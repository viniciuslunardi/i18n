import { UNPROCESSABLE_ENTITY, OK, INTERNAL_SERVER_ERROR } from 'http-status';
import { Response, Request, Router } from 'express';
import * as Globalize from 'globalize';

import * as httpUtil from '../util/request';
import messages from '../messages/messages.json';
import BaseController from './baseController';

const bundles = ['en', 'pt'];

Globalize.load(require("cldr-data").entireSupplemental());
Globalize.load(require("cldr-data").entireMainFor("en", "pt"));
Globalize.loadTimeZone(require("iana-tz-data"));
Globalize.loadMessages(messages);

export default class ConvertController extends BaseController {
  private name = 'convert';
  private url = 'https://currency-converter5.p.rapidapi.com/currency/convert';
  private defaultHeaders = {
    'X-RapidAPI-Key': process.env.API_KEY as string,
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


  async convertCurrency(req: Request, res: Response): Promise<Response> {
    const { query } = req;

    const locale = query.locale || process.env.DEFAULT_LOCALE || 'pt';

    //@ts-ignore
    if (!bundles.includes(locale)) {
      return res.status(UNPROCESSABLE_ENTITY).send(Globalize.formatMessage('ERROR_MESSAGES/MISSING_BUNDLE'));
    }

    //@ts-ignore
    Globalize.locale(locale);

    if (!query.from) {
      return res.status(UNPROCESSABLE_ENTITY).send(Globalize.formatMessage('ERROR_MESSAGES/NO_FROM_ARG'));
    } else if (!query.to) {
      return res.status(UNPROCESSABLE_ENTITY).send(Globalize.formatMessage('ERROR_MESSAGES/NO_TO_ARG'));
    } else if (!query.amount) {
      return res.status(UNPROCESSABLE_ENTITY).send(Globalize.formatMessage('ERROR_MESSAGES/NO_AMOUNT_ARG'));
    }


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
            const date = Globalize.formatDate(new Date());

            //@ts-ignore
            const from = Globalize.currencyFormatter(query.from, { style: "name" })(parseInt(query.amount));

            //@ts-ignore
            const to = Globalize.currencyFormatter(query.to, { style: "name" })(parseInt(currencyValue));

            const message = Globalize.messageFormatter("CURRENCY_MESSAGE")({
              date,
              from,
              to
            });;

            return res.status(OK).send({ message });
          }
        }
      }

      return res.status(INTERNAL_SERVER_ERROR).send(Globalize.formatMessage('ERROR_MESSAGES/CURRENCY_SERVICE_ERROR'));
    } catch (err) {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send(Globalize.formatMessage('ERROR_MESSAGES/GENERIC_ERROR_MESSAGE'));
    }
  }
}