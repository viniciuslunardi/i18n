# Currency Converter
### Esta é uma simples API que converte valores monetários, apenas para demonstrar o uso de I18N e L18N utilizando Node.js, Express, TypeScript e Globalize.js. 


### Features
- Web server com [express](https://www.npmjs.com/package/express "express")
- I18N e L18N com biblioteca [Globalize](https://www.npmjs.com/package/globalize "Globalize")

### Instalação 
```sh
git clone https://github.com/viniciuslunardi/i18n.git
cd i18n
npm install
```

### Commands

Run application

```sh            
npm run start
```

Run build

```sh            
npm run build

```
### Rotas
Exemplo de uso:
```sh            
curl --location --request GET 'http://localhost:8989/api/convert?from=EUR&to=BRL&amount=160&locale=pt'
```
* Valores fracionários ainda não tem suporte: 

Response:
```
 {"message": "Hoje (23/07/2022), a quantidade de 160,00 Euros é igual a 894,00 Reais brasileiros" }
```

### Variáveis de ambiente

env  | value
------------- | -------------
PORT | 3000
AP_KEY | 'secret-cat'

### Locales 
env  | value
------------- | -------------
en | 'en'
pt (default) | 'pt'

* Node version: v18.1.0
* Precisa instalar globalmente o typescript para poder compilar e rodar o código localmente (pode requerer persimssões de usuário)
```sh            
npm install -g typescript
```