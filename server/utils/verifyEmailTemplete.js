const verifyEmailtemplate = ({name, url})=>{
    return `
    <p>Dear ${name}</p>
    <p> thanks you for registering N Mart.<p>
    <a href=${url} style="color:white;background :blue;margin-top:10px">
    Verify Email</a>
    `
}
export default verifyEmailtemplate