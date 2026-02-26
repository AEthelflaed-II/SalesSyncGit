import { Injectable } from '@nestjs/common';
import { ConfigService } from '@/config/config.service';
import { BaseService } from '@/infra/base/base.service';
import { HTTPService } from '@/infra/base/http.service';
import {
  BrazilPaysChargeCalculateRequest,
  BrazilPaysChargeCalculateResponse,
} from './interfaces/brazilpays-charge-calculate.interfaces';
import { ApplicationError } from '@/common/errors/application.error';
import {
  BrazilPaysPaymentStatus,
  BrazilPaysResponse,
} from './interfaces/brazilpays.interfaces';
import {
  BrazilPaysChargeCreateRequest,
  BrazilPaysChargeCreateResponse,
} from './interfaces/brazilpays-charge-create.interfaces';
import {
  BrazilPaysBaseChargeCreateRequest,
  BrazilPaysBaseChargeCreateResponse,
} from './interfaces/brazilpays-basecharge-create.interfaces';
import { BrazilPaysTokenResponse } from './interfaces/brazilpays-token.interfaces';
import { BrazilPaysFindChargeResponse } from './interfaces/brazilpays-find-charge.interfaces';
import { PaymentLinkStatus } from '@/app/payment-link/enums/payment-link.enum';
import { PaymentStatus } from '@/app/payment/enums/payment.enum';

@Injectable()
export class BrazilPaysService extends BaseService {
  private accessToken: string = '';
  private expiresAt: Date = new Date();
  private readonly client: HTTPService = new HTTPService(this.config.BRAZILPAYS_API_URL, {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

  constructor(private readonly config: ConfigService) {
    super();
  }

  async onModuleInit() {
    const { access_token, expires } = await this.generateAccessToken();
    this.accessToken = access_token;
    this.expiresAt = this.getExpiresAt(expires);
  }

  async getAccessToken() {
    if (this.expiresAt.getTime() - new Date().getTime() < 60 * 1000) {
      const { access_token, expires } = await this.generateAccessToken();
      this.accessToken = access_token;
      this.expiresAt = this.getExpiresAt(expires);
    }

    return this.accessToken;
  }

  async generateAccessToken() {
    try {
      const { data } = await this.client.post('/Merchant/External/Token', undefined, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          merchantCode: this.config.BRAZILPAYS_MERCHANT_CODE,
          publicKey: this.config.BRAZILPAYS_PUBLIC_KEY,
        },
      });

      return this.validate<BrazilPaysTokenResponse>(data).data;
    } catch (error) {
      console.log('Error getting token', error);
      throw this.errorHandler(error, 'I.BP.02');
    }
  }

  async chargeCalculate(payload: BrazilPaysChargeCalculateRequest) {
    try {
      const { data } = await this.client.post<
        BrazilPaysResponse<BrazilPaysChargeCalculateResponse>
      >('/Charge/Calculate', payload, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });

      return this.validate(data).data;
    } catch (error) {
      throw this.errorHandler(error, 'I.BP.03');
    }
  }

  async baseChargeCreate(payload: BrazilPaysBaseChargeCreateRequest) {
    try {
      const { data } = await this.client.post<
        BrazilPaysResponse<BrazilPaysBaseChargeCreateResponse>
      >('/BaseCharge', payload, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });
      return this.validate(data).data;
    } catch (error) {
      throw this.errorHandler(error, 'I.BP.04');
    }
  }

  async chargeCreate(payload: BrazilPaysChargeCreateRequest) {
    try {
      const { data } = await this.client.post<
        BrazilPaysResponse<BrazilPaysChargeCreateResponse>
      >('/Charge', payload, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });
      return this.validate(data).data;
    } catch (error) {
      this.logger.error('Erro ao criar transação');
      this.logger.error(JSON.stringify(error.response?.data));
      throw this.errorHandler(error, 'I.BP.05');
    }
  }

  async findCharge(id: string) {
    try {
      const { data } = await this.client.get<
        BrazilPaysResponse<BrazilPaysFindChargeResponse>
      >(`/Charge/${id}`, {
        headers: {
          Authorization: `Bearer ${await this.getAccessToken()}`,
        },
      });
      return this.validate(data).data;
    } catch (error) {
      throw this.errorHandler(error, 'I.BP.06');
    }
  }

  getExpiresAt(expires: string) {
    const [date, time] = expires.split(/\s/);
    return new Date(`${date.split(/\//).reverse().join('-')}T${time}-03:00`);
  }

  validate<T extends object>(data: BrazilPaysResponse<T>) {
    if (!data || data?.erro || data?.errors) {
      throw new ApplicationError({
        module: 'BrazilPays',
        code: 'I.BP.01',
        message: data.message,
        details: data.errors,
      });
    }

    return data;
  }

  getPaymentStatus(status: BrazilPaysPaymentStatus) {
    const statusMap: Record<BrazilPaysPaymentStatus, PaymentStatus> = {
      [BrazilPaysPaymentStatus.PENDING]: PaymentStatus.PENDING,
      [BrazilPaysPaymentStatus.PAID]: PaymentStatus.PAID,
      [BrazilPaysPaymentStatus.REFUSED]: PaymentStatus.REFUSED,
      [BrazilPaysPaymentStatus.EXPIRED]: PaymentStatus.EXPIRED,
      [BrazilPaysPaymentStatus.CANCELED]: PaymentStatus.CANCELED,
      [BrazilPaysPaymentStatus.RELEASED]: PaymentStatus.RELEASED,
      [BrazilPaysPaymentStatus.REVERSED]: PaymentStatus.REVERSED,
    };

    return statusMap[status] || PaymentStatus.PENDING;
  }

  getPaymentLinkStatus(status: BrazilPaysPaymentStatus) {
    const statusMap: Record<BrazilPaysPaymentStatus, PaymentLinkStatus> = {
      [BrazilPaysPaymentStatus.PENDING]: PaymentLinkStatus.PENDING,
      [BrazilPaysPaymentStatus.PAID]: PaymentLinkStatus.PAID,
      [BrazilPaysPaymentStatus.REFUSED]: PaymentLinkStatus.FAILED,
      [BrazilPaysPaymentStatus.EXPIRED]: PaymentLinkStatus.EXPIRED,
      [BrazilPaysPaymentStatus.CANCELED]: PaymentLinkStatus.CANCELED,
      [BrazilPaysPaymentStatus.RELEASED]: PaymentLinkStatus.FAILED,
      [BrazilPaysPaymentStatus.REVERSED]: PaymentLinkStatus.FAILED,
    };

    return statusMap[status] || PaymentLinkStatus.PENDING;
  }

  errorHandler(error: any, code: string) {
    if (error instanceof ApplicationError) {
      throw error;
    }

    throw new ApplicationError({
      module: 'BrazilPays',
      code,
      message: error.response?.data.message || error.message,
      details: error.response?.data.errors,
      status: error.response?.status,
    });
  }
}
