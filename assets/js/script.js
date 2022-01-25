$(document).ready(function(){
    $("#registro").hide();
    $("#content").hide();
    $("#footer-redSocial").hide();

    $("#btn-register").click(function(){
        $("#login-container").hide();
        $("#registro").show();
    })
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
    apiKey: "AIzaSyAdNq0ptZ9n99DlBgOuNSTZJb-_7Vpy_YY",
    authDomain: "red-social-kpop.firebaseapp.com",
    projectId: "red-social-kpop",
    storageBucket: "red-social-kpop.appspot.com",
    messagingSenderId: "721059467341",
    appId: "1:721059467341:web:42c2136bc1c79cf5040c04",
    measurementId: "G-7YSF1R838F"
    };

    //Inicializar Firebase
    firebase.initializeApp(firebaseConfig);

    //Inicializar servicio de autentificacion
    const auth = firebase.auth();

    //Login o inicio de sesion
    $("#btn-login").click(function(e){
        e.preventDefault();
        //Variables de inputs
        var correo = $("#mail").val();
        var clave = $("#pass").val();
        //Usar servicio de login de firebase
        auth.signInWithEmailAndPassword(correo,clave)
        .then(userCredential=>{
            Swal.fire({
                title:'Datos Correctos',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
        })
        .catch((error) =>{
            let errorCode = error.code;
            let errorMessage = error.message;
            alert("Código: "+errorCode+ ". Mensaje: "+errorMessage);
        }) 
    })

    //Singup o crear cuenta
    $("#btn-singup").click(function(e){
        e.preventDefault();
        //Variables de inputs
        var correo = $("#mail-new").val();
        var clave = $("#pass-new").val();
        //Usar servicio de firebase para crear cuenta
        auth.createUserWithEmailAndPassword(correo,clave)
        .then(userCredential=>{
            $("#login-container").show();
            $("#registro").hide();footer-login
            $("#footer-login").hide();


            Swal.fire({
                title:'Cuenta Creada',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
        })
        .catch((error)=>{
            let errorCode = error.code;
            let errorMessage = error.message;
            alert("Código: "+errorCode+". Mensaje: "+errorMessage);
        })
    })
    //Desconexion de usuario
    //Boton LogOut
    $("#btn-logout").click(function(e){
        e.preventDefault();
        auth.signOut().then(() => {
            Swal.fire({
                title:'Sesion Cerrada',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
            $("#content").hide();
            $("#login-container").show();
            $("#footer-login").show();

        })
    })

    var provider = new firebase.auth.GoogleAuthProvider();
    //Inicar sesion con GOOGLE
    $("#btn-login-google").click(function(e){
        e.preventDefault();
        auth.signInWithPopup(provider)
        .then(result => {
            Swal.fire({
                title:'Ingreso con google',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
        })
        .catch(error =>{
            alert(error);
        })
    })

    var providerFace = new firebase.auth.FacebookAuthProvider();
    //Inciar sesion con Facebook
    $("#btn-login-facebook").click(function(e){
        e.preventDefault();
        auth.signInWithPopup(providerFace)
        .then(result => {
            Swal.fire({
                title:'Ingreso con Facebook',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
            ;
        })
        .catch(error =>{
            alert(error);
        })
    })

    auth.onAuthStateChanged((user)=>{
        if(user){
            //Sesion Iniciada
            $("#login-container").hide();
            $("#registro").hide();
            $("#footer-login").hide();
            $("#content").show();
            readPosts();
        }
        else{
            //Sesion finalizada
            $("#footer-login").show();
            $("#content").hide();
            $("#desaparecido").hide();
            $("#login-container").show();
        }
    })

    const db = firebase.firestore();
    //Publicar un nuevo estado
    $("#btn-publish").click(function(e){
        e.preventDefault();
        let postText = $("#status-text").val();
        let date = new Date();
        db.collection("posts").add({
            text: postText,
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            hours: date.getHours(),
            minutes: date.getMinutes(),
            seconds: date.getSeconds(),
        })
        .then((docRef)=>{
            
            Swal.fire({
                title:'Estado publicado',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
            $("#status-text").val('');
            readPosts();
        })
        .catch((error)=>{
            alert(error);
        })
    })

    function readPosts(){
        db.collection("posts").get().then((posts)=>{
            listPosts(posts.docs);
        })
    }

    function listPosts(data){
        var divContent = $("#post-feed");
        divContent.empty();
        if(data.length > 0){
            let content = "";
            data.forEach(document => {
                let doc = document.data();
                const divPost =`
                <div class="caja" style='border: solid 2px rgb(209, 171, 99)'>
                    <p style="margin-bottom: 0px; margin-bottom: -8px;" >${doc.text}</p> <br>
                    <textarea style='display: none;'></textarea>
                    <button data-id="${document.id}" style='display: none;' class="btn btn-info btn-save-post"><i class="far fa-save lead me-2"></i>Guardar</button>
                    <button style='display: none;' class="btn btn-info btn-cancel-post"><i class="fas fa-ban lead me-2"></i>Cancelar</button>

                    <span>Publicado el: ${doc.day}/${doc.month}/${doc.year} Hora ${doc.hours}:${doc.minutes}:${doc.seconds}.</span>
                    <br>
                    <button id="btn-editar" data-id="${document.id}" class="btn btn-warning btn-edit-post mt-2 mx-2"><i class="fas fa-edit lead me-2"></i>Editar</button>
                    <button id="btn-eliminar" data-id="${document.id}" class="btn btn-danger btn-delete-post mt-2"><i class="fas fa-trash-alt lead me-2"></i>Eliminar</button>
                </div>
                <hr>
                `;
                content += divPost;
            });
            divContent.append(content);
                //Agregar listener a btn-delete
                const btnDelete = document.querySelectorAll(".btn-delete-post");
                btnDelete.forEach(btn=>{
                    btn.addEventListener("click",(e)=>{
                    const id = e.target.dataset.id;
                    DeletePost(id);
                    })
                })
                const btnEdit = document.querySelectorAll(".btn-edit-post");
                btnEdit.forEach(btn=>{
                btn.addEventListener("click",(e)=>{
                const id = e.target.dataset.id;
                OpenEdit(e,id,btn);
                })
            })
        }
    }
    function OpenEdit(e,id,button){
        let parent = button.parentNode;
        let textEdit = $(parent).children().eq(2);
        let btnEdit = $(parent).children().eq(3);
        let btnCancel = $(parent).children().eq(4);
        
        textEdit.show();
        btnEdit.show();
        btnCancel.show();
        $("#btn-editar").hide();
        $("#btn-eliminar").hide();

        btnEdit.on("click",function(e){
            SaveUpdate(e,id,textEdit.val())
        });
    }
    

    function DeletePost(id){
        db.collection("posts").doc(id).delete().then(() => {
            
            Swal.fire({
                title:'Se ha eliminado correctamente',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
            readPosts();
        })
        .catch((error) => {
            console.error("Detalle del Error: ", error);
        });
    }
    function UpdatePost(id){
        db.collection("posts").doc(id).get().then((doc)=>{
            const post = doc.data();
            $("").val(item.post);
        })
        .catch((error) => {
            alert("Error: ", error);
        });
    }

    function SaveUpdate(e,id_post,text_new){
        e.preventDefault();
        db.collection("posts").doc(id_post).update({
            text: text_new,
        }).then(()=>{
            Swal.fire({
                title:'Post Actualizado',
                text:'Preciones Ok para continuar',
                background:"#fff",
                // color de fondo de la ventana[abajo]
                backdrop:true,
                timer:8000,
                // tiempo de ventana [abajo]
                timerProgressBar: true,
                allowOutsideClick:false,
                confirmButtonColor:'#f37db4',
                })
            readPosts();
        })
        .catch((error)=>{
            alert("Error:",error);
        });

    }

    $("#btn_update").click(function(e){
        e.preventDefault();
        let post_upgrade = $("").val();
        let id_post = $("").val();
        db.collection("posts").doc(id_post).update({
            post: post_upgrade,
        }).then(()=>{
            
            alert("Post Actualizado")
        })
        .catch((error)=>{
            alert("Error: ", error);
        })
    })
})