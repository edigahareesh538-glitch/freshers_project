function loginbtn(){
    const email=document.getElementById("email");
    const password=document.getElementById("password");
    if(email.value=="edigahareesh0@gmail.com" & password.value=="810646"){
        alert("Login Successfully")
        window.location.href='admin.html'
    }
    else{
        alert("Invalid Credentials. please try again.")
    }
}