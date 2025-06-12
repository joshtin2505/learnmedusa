import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import { AuthorizePaymentInput, AuthorizePaymentOutput, CancelPaymentInput, CancelPaymentOutput, CapturePaymentInput, CapturePaymentOutput, DeletePaymentInput, DeletePaymentOutput, GetPaymentStatusInput, GetPaymentStatusOutput, InitiatePaymentInput, InitiatePaymentOutput, Logger, ProviderWebhookPayload, RefundPaymentInput, RefundPaymentOutput, RetrievePaymentInput, RetrievePaymentOutput, UpdatePaymentInput, UpdatePaymentOutput, WebhookActionResult } from "@medusajs/framework/types"
import { MercadoPagoConfig, Order, Payment, Preference } from "mercadopago"

type Options = {
    accessToken: string
    webhookSecret?: string
    successUrl?: string
}

type InjectedDependencies = {
    logger: Logger
}

class MercadoPagoProviderService extends AbstractPaymentProvider<Options> {
    static identifier = "mercadopago"

    protected logger_: Logger
    protected options_: Options
    protected client: MercadoPagoConfig  // Cliente SDK de MercadoPago
    protected orderApi: Order            // API de ordenes de MercadoPago
    protected paymentApi: Payment
    protected preferenceApi: Preference // API de preferencias de MercadoPago


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
        this.preferenceApi = new Preference(this.client)
    }

    async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
        console.log("Initiating MercadoPago payment with input:", input)
        const { amount, currency_code, context: customerDetails } = input
        const preference = await this.preferenceApi.create({
            body: {
                items: [{
                    title: "Compra en tienda",
                    quantity: 1,
                    unit_price: Number(amount), // Convertir a unidades monetarias
                    currency_id: currency_code.toUpperCase(),
                    id: customerDetails?.idempotency_key || "default-item-id"
                }],
                back_urls: {
                    success: this.options_.successUrl,
                    failure: this.options_.successUrl,
                    pending: this.options_.successUrl,

                },
                auto_return: "approved",
            }
        })
        return {
            id: preference?.id || "id",
            data: {
                preferenceId: preference.id,
                initPoint: preference.init_point,
            }
        }
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
        const preferenceData = {
            external_reference: input.data
        }
        throw new Error("Method not implemented.");
    }
    async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
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