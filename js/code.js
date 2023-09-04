let inc = 100;
$("#meals").ready(function () {
    $(".spinner-home").fadeOut(800)
})
function Show() {
    $(".sidebar").animate({ left: "0" }, 500);
    $(".links p").each(function () {
        $(this).animate({ top: 0 }, 350 + inc)
        inc += 100
    })
    $("#open").addClass("hidden");
    $("#close").removeClass("hidden");
}
function Hide() {
    if(inc==100)
        return
    $(".sidebar").animate({ left: "-250" }, 500)
    $(".links p").each(function () {
        $(this).animate({ top: 400 }, 350 + inc)
        inc -= 100
    })
    $("#close").addClass("hidden");
    $("#open").removeClass("hidden");
}
async function getMealByLetter(letter) {
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await req.json();
    displayMeals(data.meals);
}
async function getMealByName(name) {
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await req.json();
    displayMeals(data.meals);
}
async function getMealByCategory(name) {
    Hide();
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`);
    let data = await req.json();
    displayMeals(data.meals)
}
async function getMealDetails(id) {
    Hide();
    $(".mainData").html(`        <div class="spinner">
    <i class="fa-solid fa-spinner fa-spin"></i>
</div>`)
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    let data = await req.json();

    let html = `
            <div class="container">
                <div class="row text-white">
                    <div class="col-md-4">
                        <div>
                            <img src="${data.meals[0].strMealThumb}"
                                class=" rounded-3 w-100" alt="">
                        </div>
                        <p class="fs-2 px-1 fw-bold">${data.meals[0].strMeal}</p>
                    </div>
                    <div class="col-md-8">
                        <div>
                            <p class="fs-2 fw-bold">Instructions</p>
                            <p>${data.meals[0].strInstructions}</p>
                            <p class="fs-3 fw-medium"><span class="fs-2 px-1 fw-bold">Area :</span>${data.meals[0].strArea}</p>
                            <p class="fs-3 fw-medium"><span class="fs-2 px-1 fw-bold">Category :</span>${data.meals[0].strCategory}</p>
                            <p class="fs-3 fw-bold">Reciepes :</p>
                            <div class="d-flex gap-3 py-2 flex-wrap" id="ingredients">
                            </div>
                            <p class="fs-3 fw-bold">tags:</p>
                            <div class="d-flex gap-3 flex-wrap" id="tags">
                            </div>
                            <div class="d-flex pt-4 gap-2">
                                <button class="btn btn-success"><a target="_blank" href="${data.meals[0].strYoutube}">Youtube</a></button>
                                <button class="btn btn-danger"><a href="${data.meals[0].strSource}">Source</a></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    $(".mainData").html(html);
    let temp = ``;
    for (let i = 1; i < 20; i++) {
        if (data.meals[0][`strIngredient${i}`] == "" || data.meals[0][`strIngredient${i}`] == null)
            break;
        temp += `                               
              <div
             class="ing border border-0  d-flex justify-content-center align-items-center rounded-3">
             <p class="p-2 m-0">${data.meals[0][`strIngredient${i}`]}</p>
         </div>`;
    }
    let temp2 = ``;
    if (data.meals[0].strTags != "" && data.meals[0].strTags != null) {
        let tags = data.meals[0].strTags.split(",")

        for (i = 0; i < tags.length; i++) {
            temp2 += `                               
            <div
            class="ing border border-0 d-flex justify-content-center align-items-center rounded-3">
            <p class="p-2 m-0">${tags[i]}</p>
        </div>`;
        }
    }
    $("#ingredients").html(temp);
    $("#tags").html(temp2);
}
async function getCategory() {
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    let data = await req.json();
    let html = ``
    for (let index = 0; index < data.categories.length; index++) {
        html += `                        
        <div class="col-md-3 pe-1 position-relative" data-id="${data.categories[index].strCategory}">
            <div class="item rounded-3 position-relative overflow-hidden">
                <img src="${data.categories[index].strCategoryThumb}" class="w-100 " alt="">
                <div class="overlay rounded-3 text-center">
                    <p class="text-center p-0 m-0 fw-medium">${data.categories[index].strCategory}</p>
                    <p class="fs-5 px-2">${data.categories[index].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
            </div>
        </div>`
    }
    $("#meals").html(html);
    $(".spinner").fadeOut(9)
    $(".col-md-3").click(function () {
        getMealByCategory($(this).attr("data-id"))
    })
}
function displayMeals(data) {
    let html = ``
    if (data == null) {
        $(".spinner").fadeOut()
        $("#meals").html("");
        return
    }
    for (let index = 0; index < data.length && index < 20; index++) {
        html += `                        
        <div class="col-md-3 pe-1 position-relative" data-id="${data[index].idMeal}">
            <div class="item rounded-3 position-relative overflow-hidden" >
                <img src="${data[index].strMealThumb}" class="w-100 " alt="">
                <div class="overlay rounded-3 d-flex align-items-center">
                    <p>${data[index].strMeal}</p>
                </div>
            </div>
        </div>`
    }
    $("#meals").html(html);
    $(".spinner").fadeOut(9)
    $(".col-md-3").click(function () {
        getMealDetails($(this).attr("data-id"))
    })
}
function search() {
    Hide();
    $(".mainData").html("")
    let html = `
    <section id="search">
    <div class="container search-box d-flex justify-content-center  py-5">
        <div class="col-md-9 d-flex gap-4 z-2">
            <input id="name" type="text" placeholder="Search By Name"
                class="form-control bg-black text-white py-2 px-2 w-50">
            <input id="letter" type="text" placeholder="Search By First Letter"
                class="form-control bg-black text-white py-2 px-2 w-50">
        </div>
        <div class="spinner">
            <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
    </div>
    </section>
        <section id="data">
        <div class="container">
            <div>
                <div class="row gy-3" id="meals">
                </div>
            </div>
        </div>
    </section>`
        ;
    $(".mainData").html(html)
    $("#letter").keypress(function () {
        $(this).val($(this).val().slice(0, 0));
    })
    $("#letter").keyup(function () {
        if ($(this).val().length == 1 && $(this).val() != " ")
            getMealByLetter($(this).val());
    })
    $("#name").keyup(function () {
        getMealByName($(this).val());
    })
}
function categories() {
    Hide();
    $(".mainData").html("");
    let html = `        
    <section id="category">
        <div class="spinner">
             <i class="fa-solid fa-spinner fa-spin"></i>
        </div>
        <div class="container">
            <div>
                <div class="row gy-3" id="meals"></div>
            </div>
        </div>
    </section>`
    $(".mainData").html(html);
    getCategory();
}
async function getMealByArea(area) {
    Hide();
    $(".spinner").css("display", "flex")
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await req.json();
    displayMeals(data.meals)
}
function load() {
    $(".mainData").html(`
    <div class="spinner">
        <i class="fa-solid fa-spinner fa-spin"></i>
    </div>
    
    <section id="data">
    <div class="container">
        <div>
            <div class="row gy-3" id="meals">
            </div>
        </div>
    </div>
</section>`
    )
    $(".spinner").css("display", "flex")
}
async function getArea() {
    Hide()
    load();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    let data = await req.json();
    let html = ``
    for (let index = 0; index < data.meals.length; index++) {
        html += `                        
        <div class="col-md-3" data-area="${data.meals[index].strArea}">
            <div class="border-3 bg-black text-white text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <p class="fs-2 fw-medium">${data.meals[index].strArea}</p>
            </div>
    </div>`
    }
    $("#meals").html(html);
    $(".spinner").fadeOut(9)
    $(".col-md-3").click(function () {
        getMealByArea($(this).attr("data-area"))
    })
}
async function getMealByIngredient(name) {
    Hide();
    load();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${name}`);
    let data = await req.json();
    let html = ``
    displayMeals(data.meals);
}
async function getIngredient() {
    Hide()

    load();
    let req = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i= `);
    let data = await req.json();
    let html = ``
    for (let index = 0; index < 20; index++) {
        html += `                       
        <div class="col-md-3" data-id="${data.meals[index].strIngredient}">
        <div class="text-center text-white item">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
            <p class="fs-3 fw-medium p-0 m-0">${data.meals[index].strIngredient}</p>
            <p>${data.meals[index].strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
    </div>`
    }
    $("#meals").html(html);
    $(".spinner").fadeOut(9)
    $(".col-md-3").click(function () {
        getMealByIngredient($(this).attr("data-id"))
    })
}
function Contact() {
    Hide()
    let html = `
    <section id="contact" class="d-flex min-vh-100 justify-content-center align-items-center">
    <div class="container  ">
        <div>
            <div class="row px-5 gy-3">
                <div class="col-md-6 ps-5">
                    <div>
                        <input onkeyup="validateName(this.value)" type="text" class="form-control px-3 py-2 " placeholder="Enter Your Name">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div>
                        <input onkeyup="validateEmail(this.value)" type="email" class="form-control px-3 py-2 " placeholder="Enter Your Email">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="name">
                        <p class="text-center py-4 px-2 rounded-2">Special characters and numbers not allowed</p>
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="email">
                        <p class="text-center py-4 px-2 rounded-2">Email not valid *exemple@yyy.zzz</p>
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div >
                        <input onkeyup="validatePhone(this.value)" type="text" class="form-control px-3 py-2 " placeholder="Enter Your Phone">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div>
                        <input onkeyup="validateAge(this.value)" type="number" class="form-control px-3 py-2 " placeholder="Enter Your Age">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="phone">
                        <p class="text-center py-4 px-2 rounded-2">Enter valid Phone Number</p>
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="age">
                        <p class="text-center py-4 px-2 rounded-2">Enter valid age</p>
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div >
                        <input onkeyup="validatePassword(this.value)" type="text" class="form-control px-3 py-2 " placeholder="Enter Your Password">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div>
                        <input onkeyup="validateRepassword(this.value)" type="text" class="form-control px-3 py-2 " placeholder="Repassword">
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="password">
                        <p class="text-center py-4 px-2 rounded-2">Enter valid password *Minimum eight characters, at least one letter and one number:*</p>
                    </div>
                </div>
                <div class="col-md-6 ps-5">
                    <div class="hidden" id="repassword">
                        <p class="text-center py-4 px-2 rounded-2">Passwords don't match!</p>
                    </div>
                </div>
                <div class="d-flex  justify-content-center">
                    <button class="ms-4 btn disabled btn-danger" id="btn">Submit</button>
               </div>
            </div>
        </div>
    </div>
</section>
    `
    $(".mainData").html(html);
}
let nameFlag = false;
let emailFlag = false;
let phoneFlag = false;
let ageFlag = false;
let passwordFlag = false;
let repasswordFlag = false;
let pass = "";
function test(word, pattern, id) {
    if (!pattern.test(word)) {
        error(id);
    }
    else {
        correct(id)
    }
    return pattern.test(word)
}
function isEnabled() {
    if (nameFlag && emailFlag
        && phoneFlag
        && ageFlag
        && passwordFlag
        && repasswordFlag)
        $("#btn").removeClass("disabled")
    else
        $("#btn").addClass("disabled")
}
function error(id) {
    $(id).removeClass("hidden")
}
function correct(id) {
    $(id).addClass("hidden")

}
function validateName(name) {
    let namePattern = /^[a-zA-Z]{1,}$/;
    nameFlag = test(name, namePattern, "#name")
    isEnabled();
}
function validatePhone(phone) {
    let phonePattern = /^(002|\+2)?01[1205][0-9]{8}$/;
    phoneFlag = test(phone, phonePattern, "#phone")
    isEnabled();
}
function validateEmail(email) {
    let emailPattern = /^[a-zA-Z0-9]{1,}@(gmail|yahoo).com$/;
    emailFlag = test(email, emailPattern, "#email")
    isEnabled();
}
function validateAge(age) {
    let agePattern = /^[1-9]{1,2}$/;
    ageFlag = test(age, agePattern, "#age")
    isEnabled();
}

function validatePassword(password) {
    let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    passwordFlag = test(password, passwordPattern, "#password")
    pass = password;
    isEnabled();
}
function validateRepassword(repassword) {
    if (repassword == pass) {
        repasswordFlag = true;
        correct("#repassword")
    }
    else {
        repasswordFlag = false;
        error("#repassword")
    }
    isEnabled();
}
getMealByName("")