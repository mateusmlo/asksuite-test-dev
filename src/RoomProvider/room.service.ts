import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import puppeteer, { Page } from 'puppeteer';
import { TimeframeDTO } from './dto/timeframe.dto';
import { JSDOM } from 'jsdom';
import { RoomDTO } from './dto/room.dto';

@Injectable()
export class RoomService {
  private logger = new Logger('RoomService');

  private async setupPageContext() {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 1366, height: 768 },
      headless: 'new',
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    return { page, browser };
  }

  async searchRooms({ checkin, checkout }: TimeframeDTO) {
    const checkinDate = DateTime.fromISO(checkin);
    const checkoutDate = DateTime.fromISO(checkout);

    this.validateTimeframes(checkinDate, checkoutDate);

    const { page, browser } = await this.setupPageContext();

    const checkinLocale = checkinDate.toFormat('dd/MM/yyyy');
    const checkoutlocale = checkoutDate.toFormat('dd/MM/yyyy');

    await page.goto(
      `https://pratagy.letsbook.com.br/D/Reserva?checkin=${checkinLocale}&checkout=${checkoutlocale}&cidade=&hotel=12&adultos=2&criancas=&destino=Pratagy+Beach+Resort+All+Inclusive&promocode=&tarifa=`,
      { waitUntil: 'networkidle2' },
    );

    const content = await this.getRoomsInformation(page);

    await browser.close();

    return content;
  }

  private validateTimeframes(checkinDate: DateTime, checkoutDate: DateTime) {
    //* the website hangs until timeout if we use past dates so that's a no-no
    if (
      checkinDate.diffNow().milliseconds < 0 ||
      checkoutDate.diffNow().milliseconds < 0
    ) {
      throw new BadRequestException('dates cannot be in the past');
    }

    if (checkoutDate.diff(checkinDate).milliseconds < 0) {
      throw new BadRequestException(
        'Check-out date cannot be before the check-in',
      );
    }
  }

  private async getRoomsInformation(page: Page) {
    //* we wait for a room option element to load, if it timeouts then there are no rooms available
    await page
      .waitForSelector('.room-option-wrapper', { timeout: 10000 })
      .catch((err) => {
        this.logger.error(err);
        return [];
      });

    // https://github.com/puppeteer/puppeteer/issues/303
    //* here we take from the page only what we need: the rooms section
    const roomsHTML = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('.room-option-wrapper'));

      return els.map((el) => el.innerHTML);
    });

    const rooms = roomsHTML.map(this.extractRoomInformation);

    return rooms;
  }

  private extractRoomInformation(room: string): RoomDTO {
    //* take the big HTML string with an individual room info and transform into a nice DOM we can traverse
    const roomContent = new JSDOM(`<!DOCTYPE html> ${room}`, {
      contentType: 'text/html',
    }).window.document;

    const name = roomContent.querySelector(
      '.room-option-title--title',
    ).textContent;

    const description = roomContent.querySelector(
      '.room-option-title--amenities',
    ).textContent;

    const price = roomContent
      .querySelector('.daily-price--total')
      .textContent.split('Em')[0];

    const image = roomContent
      .querySelector('.q-carousel__slide')
      .outerHTML.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png)/)[0];

    return { name, description, image, price };
  }
}
