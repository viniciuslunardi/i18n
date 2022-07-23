import { UNPROCESSABLE_ENTITY, OK, INTERNAL_SERVER_ERROR } from 'http-status';
import { Response, Request, Router } from 'express';
import * as httpUtil from '../util/request';


import BaseController from './baseController';

export default class ConvertController extends BaseController {
  private name = 'convert';
  private url = 'https://currency-converter5.p.rapidapi.com/currency/convert';
  private defaultHeaders = {
    'X-RapidAPI-Key': '324aa7e4b2mshd6be44983511ae6p11540fjsn060abd1c8f7f',
    'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
  }

  private request = new httpUtil.Request();
  constructor(router: Router) {
    super(router);
    this.initBinds();
  }

  public getName(): string {
    return this.name;
  }

  protected initBinds(): void {
    this.router.get(`/${this.name}`, this.convertCurrency.bind(this));
  }


  // const options = {
  //   method: 'GET',
  //   url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
  //   params: {format: 'json', from: 'AUD', to: 'CAD', amount: '1'},
  //   headers: {
  //     'X-RapidAPI-Key': '324aa7e4b2mshd6be44983511ae6p11540fjsn060abd1c8f7f',
  //     'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
  //   }
  // };

  // axios.request(options).then(function (response) {
  // 	console.log(response.data);
  // }).catch(function (error) {
  // 	console.error(error);
  // });

  async convertCurrency(req: Request, res: Response): Promise<Response> {
    console.log(req.query);
    const { query } = req;

    if (!query.from) {
      return res.status(UNPROCESSABLE_ENTITY).send('MISSING FROM ARGUMENT:' + this.getName());
    } else if (!query.to) {
      return res.status(UNPROCESSABLE_ENTITY).send('MISSING TO ARGUMENT:' + this.getName());
    } else if (!query.amount) {
      return res.status(UNPROCESSABLE_ENTITY).send('MISSING AMOUNT ARGUMENT:' + this.getName());
    }

    const locale = query.locale || process.env.DEFAULT_LOCALE;

    try {
      const options = {
        method: 'GET',
        url: this.url,
        params: { format: 'json', from: query.from, to: query.to, amount: query.amount },
        headers: this.defaultHeaders
      };

      console.log(`Converting with data: ${JSON.stringify(options.params)}`);

      const response = await this.request.get<any>(`${this.url}`, options);

      if (response.status === 200) {
        const { data } = response;

        const rates = data.rates;
        if (rates) {
          //@ts-ignore
          const currencyValue = rates[query.to].rate_for_amount;

          if (currencyValue) {
            const message = `On day: ${new Date}, ${query.from} ${query.amount} is equal to ${query.to} ${currencyValue}`;
            return res.status(OK).send(message);
          }
        }
      }

      return res.status(INTERNAL_SERVER_ERROR).send('ERROR ON CURRENCY SERVICE');
    } catch (err) {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send('ERROR:' + err);
    }
  }
}