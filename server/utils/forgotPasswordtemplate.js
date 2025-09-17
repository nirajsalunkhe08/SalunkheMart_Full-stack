const forgotPasswordTemplate = ({ name, otp }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 16px; background-color: #f8f8f8; border-radius: 8px;">
      <p>Dear <strong>${name}</strong>,</p>

      <p>We received a request to reset your password. Use the OTP below to proceed:</p>

      <div style="background: yellow; font-size: 20px; padding: 10px; margin: 10px 0; display: inline-block;">
        <strong>${otp}</strong>
      </div>

      <p>This OTP is valid for <strong>1 hour</strong>. Enter this code in the SMart app to reset your password.</p>

      <br/>

      <p>Thanks,<br/>The SMart Team</p>
    </div>
  `;
};

export default forgotPasswordTemplate;
