import { expect } from "chai";
import { EmailBuilder } from "../../../common/email/email.builder";
import { EmailTypes } from "../../../common/models/email-types.enums";

describe("this test is prooven to email builder throw a new html render", () => {
  it("when pass an model in order to build a confirmation email account, should be a html", async () => {
    const model = {
      firstName: "Emanuel",
      lastName: "Sosa",
      id: "15241245edd4a5",
    };

    const emailBuilder = new EmailBuilder();
    const result = await emailBuilder.build(
      model,
      EmailTypes.EMAIL_COMFIRM_ACCOUNT
    );

    expect(result).to.equals(typeof String);
  });
});
