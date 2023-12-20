# backend-challenge

## Sobre o desafio

Num geral foi um desafio técnico relativamente simples, com a parte mais desafiadora tendo sido aprender e me adaptar ao Puppeteer, cujo qual eu ainda não tinha utilizado até então apesar de já saber os casos de uso, mas como eu já possuo extenso conhecimento das APIs do DOM, a curva de aprendizado foi bem curta. Alguns detalhes da minha implementação:

- O endpoint possui validação das datas: não podem estar no passado, fora do formato definido no payload do desafio (yyyy-mm-dd), ou possuir um check-out com data anterior ao check-in. 
- O Puppeteer é inicializado de forma diferente a depender do ambiente de desenvolvimento, com configurações específicas para executar em container.
- Como os elementos extraídos do Puppeteer precisam ser serializáveis, decidi utilizar o JSDOM para que eu pudesse converter as strings em um DOM e então navegar pelos elementos como no browser. Isso facilitou muito todo o processo!
- A API está documentada com Swagger e pode ser acessada em http://localhost:<PORTA>/docs
- O projeto pode ser executado tanto localmente quanto em container via Docker (também não foi muito fácil fazer o Puppeteer funcionar ali)

## Stack

- NestJS
- Puppeteer
- JSDOM
- Swagger
- Docker

## Como Rodar

Primeiramente faça uma cópia do arquivo .env.example para um .env e utilize a porta de sua escolha para a variável APP_PORT:
```sh
cp .env.example .env
```

### Para executar localmente:
```sh
# instalar as dependências
yarn

# iniciar o server
yarn start:dev

# rodar os testes
yarn test
```

### Executar no container:

Aqui temos duas opções: puxar a imagem do meu dockerhub, ou buildar localmente!

```sh
# puxar direto do dockerhub
docker pull mateusmlo/asksuite-test:latest
```

Buildar a imagem localmente:

```sh
# buildar a imagem
# ATENÇÃO: para MacOS é necessário um parametro adicional --platform linux/amd64 para a instalação do chrome
docker build --build-arg APP_PORT=3333 . -t mateusmlo/asksuite-test:latest
```

E então executar o container:

```sh 
# o valor de -p precisa ser igual ao APP_PORT
docker run -d -p 3333 mateusmlo/asksuite-test:latest 
```
