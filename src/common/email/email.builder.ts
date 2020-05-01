import { EmailTypes } from "../models/email-types.enums";
import * as path from "path";
const ejs = require("ejs-promise");

export class EmailBuilder {
  public async build(model: any, type: EmailTypes): Promise<string> {
    let html: string = "";
    switch (type) {
      case EmailTypes.EMAIL_COMFIRM_ACCOUNT:
        html = await this.LoadTemplateAsync(
          model,
          "./templates/email-confirm-account.ejs"
        );
        break;
      default:
        html = "<p></p>";
    }

    return html;
  }

  private async LoadTemplateAsync(
    params: any,
    template: string
  ): Promise<string> {
    const file = path.join(__dirname, `${template}`);
    if (!file) {
      throw new Error(`could not find ${template} in path ${file}`);
    }

    return await ejs.renderFile(
      file,
      params,
      {},
      (error: any, result: any): string => {
        if (error) {
          return error;
        }
        return result
          .then((data: any) => {
            return data;
          })
          .catch((err: any) => {
            throw err;
          });
      }
    );
  }
}
