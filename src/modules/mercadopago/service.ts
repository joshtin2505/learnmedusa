import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { AuthorizePaymentInput, AuthorizePaymentOutput, CancelPaymentInput, CancelPaymentOutput, CapturePaymentInput, CapturePaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, InitiatePaymentInput, InitiatePaymentOutput, Logger, ProviderWebhookPayload, RefundPaymentInput, RefundPaymentOutput, RetrievePaymentInput, RetrievePaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/framework/types"
import { MercadoPagoConfig, Order, Payment, } from "mercadopago"

type Options = {
    accessToken: string
    webhookSecret?: string
}

type InjectedDependencies = {
    logger: Logger
}

class MercadoPagoProviderService extends AbstractPaymentProvider<Options> {
    static identifier = "mercadopago"
    protected client: MercadoPagoConfig
    protected orderApi: Order
    protected paymentApi: Payment
    protected logger_: Logger
    protected options_: Options


    constructor(container: InjectedDependencies, options: Options) {
        super(container, options)
        this.logger_ = container.logger
        this.options_ = options

        /** @private @const {MercadoPago} */
        this.client = new MercadoPagoConfig({
            accessToken: options.accessToken,
            options: {
                timeout: 10000, // 10 seconds
            }
        })
        this.orderApi = new Order(this.client)
        this.paymentApi = new Payment(this.client)
    }

    async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
        const { data } = input
        // Suponiendo pago ya realizado vía redirect o brick
        return { data, status: "authorized" }
    }
    async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
        // Para pagos automáticos directos, no aplica cancelación previa a captura
        return { data: input.data }
    }
    async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
        const paymentId = input.data?.orderId as string
        // MercadoPago captura automático en "automatic"
        return { data: input.data }
    }
    async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
        throw new Error("Method not implemented.");
    }
    getIdentifier(): string {
        return MercadoPagoProviderService.identifier;
    }
    async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
        throw new Error("Method not implemented.");
    }
    async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
        throw new Error("Method not implemented.");
    }
    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
        throw new Error("Method not implemented.");
    }
    async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
        throw new Error("Method not implemented.");
    }
    async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
        throw new Error("Method not implemented.");
    }
    async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
        throw new Error("Method not implemented.");
    }
}

export default MercadoPagoProviderService