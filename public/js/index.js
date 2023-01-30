const currentLocation=location.href;
const menuItem=document.querySelectorAll('a');
const menuLength=menuItem.length;
for(let i=0;i<menuLength;i++){
    if(menuItem[i].href===currentLocation){
        menuItem[i].className="active"
    }
}
function myFunction(){
    alert("I am clicked");
}



const name=document.getElementById('loginname')
const password=document.getElementById('loginpassword')
const form=document.getElementById('loginform')
const errorElement=document.getElementById('error')


form.addEventListener('submit',(e)=>{
    let message=[]
    if(name.value===' ' || name.value===null){
        messages.push("name is required")
    }
    if(messages.length>0){
        e.preventDefault()
        errorElement.innerText=messages.join(', ')
    }
})