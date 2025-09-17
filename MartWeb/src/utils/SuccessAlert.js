import Swal from 'sweetalert2'
const successAlert = (title)=>{
 const alert =Swal.fire({
  title: title,
  icon: "success",
  color:"blue",
 
});
return alert
}
export default successAlert