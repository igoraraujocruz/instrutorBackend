import { PDFParse } from "pdf-parse";
import { AppError } from "../../../utils/AppError";
import { StorageProvider } from "../../../providers/StorageProvider";

interface ExpectedData {
  nome?: string;
  cpf?: string;
}

export class UploadCertificate {
  private storage = new StorageProvider();

  async execute(
    certificado: Express.Multer.File & {
      location?: string;
    },
    expected?: ExpectedData
  ) {
    try {
      const parser = new PDFParse({ url: process.env.NODE_ENV == 'development' ? certificado.path : certificado.location});

      const result = await parser.getText();
      await parser.destroy();

      const text = result.text;

      if (!this.basicChecks(text)) {
        throw new AppError("Erro ao processar o certificado [tp 1]. Envie um e-mail para gdotransito@gmail.com para receber suporte.");
      }

      if (!this.validateStructure(text)) {
        throw new AppError("Erro ao processar o certificado [tp 2]. Envie um e-mail para gdotransito@gmail.com para receber suporte.");
      }

      const fields = this.extractFields(text);

      if (!fields.cpf || !fields.codigo) {
        throw new AppError("Erro ao processar o certificado [tp 3]. Envie um e-mail para gdotransito@gmail.com para receber suporte.");
      }

      // 🔒 Validação de divergência (AGORA DENTRO DA CLASSE)
      if (expected?.nome && fields.nome) {
        if (
          this.normalize(expected.nome).toUpperCase() !==
          this.normalize(fields.nome).toUpperCase()
        ) {
          throw new AppError("Nome diferente do certificado. O nome preenchido neste formulário precisa ser igual ao nome que está no certificado. Se o erro persistir entre em contato: gdotransito@gmail.com", 400);
        }
      }

      if (expected?.cpf) {
        if (this.normalize(expected.cpf) !== this.normalize(fields.cpf)) {
          throw new AppError("CPF divergente do certificado. Se o erro persistir entre em contato: gdotransito@gmail.com", 400);
        }
      }

      return {
        valid: true,
        fields,
        certificadoCodigo: fields.codigo,
      };

    } catch (err: any) {
      // 👇 path relativo salvo no banco
      const relativePath = `certificados/${certificado.filename}`;
      await this.storage.delete(relativePath);
      throw err;
    }
  }

  // =========================
  // Normalização robusta
  // =========================
  private normalize(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/\s+/g, " ")
      .replace(/\.\s*/g, " ")
      .trim();
  }

  // =========================
  // Validação básica
  // =========================
  private basicChecks(text: string): boolean {
    const t = this.normalize(text).toUpperCase();

    const keywords = [
      "MINISTERIO",
      "CERTIFICADO",
      "CURSO",
      "CONDUTORES",
      "ENSINO",
      "DISTANCIA",
      "CODIGO",
    ];

    return keywords.every(k => t.includes(k));
  }

  // =========================
  // Estrutura esperada
  // =========================
  private validateStructure(text: string): boolean {
    const t = this.normalize(text).toUpperCase();

    const structureChecks = [
      /\b\d{11}\b/,              // CPF
      /\b\d{2}\/\d{2}\/\d{4}\b/, // Datas
      /\bCURSO\b/,
      /\bCONDUTORES\b/,
      /\bENSINO\b/,
      /\bDISTANCIA\b/,
      /\bCODIGO\b/,
      /\bCERTIFICADO\b/,
    ];

    return structureChecks.every(regex => regex.test(t));
  }

  // =========================
  // Extração segura
  // =========================
  private extractFields(text: string) {
    const t = this.normalize(text);

    const cpf = t.match(/\b\d{11}\b/)?.[0] ?? null;
    const datas = t.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) ?? [];
    const codigo = t.match(/\bn?[a-z0-9]{20,40}\b/gi)?.[0] ?? null;

    let nome: string | null = null;
    const nomeMatch = t.match(/CURSO\s+(.+?)\s+\d{11}/i);
    if (nomeMatch) {
      nome = nomeMatch[1].trim();
    }

    return { nome, cpf, datas, codigo };
  }
}
