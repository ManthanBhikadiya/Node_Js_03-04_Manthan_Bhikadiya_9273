const sendEmail = async (email, subject, text) => {
    console.log(`Email sent to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Text: ${text}`);
    return true;
};

export { sendEmail as default };