var swiper = new Swiper('.swiper-container', {
    direction: 'horizontal',
    slidesPerView: 1,
    spaceBetween: 1,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: true,
    cssMode: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
    },
    navigation: {
        nextEl: '.swiper-button-next1',
        prevEl: '.swiper-button-prev1',
    },
    breakpoints: {
        600: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 5,

        },
        1000: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 5,
            pagination: {
                dynamicBullets: false,
            },
        },
        1100: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 30,
            pagination: {
                dynamicBullets: false,
            },
        },
    },
});

var swiper2 = new Swiper('.swiper-container2', {
    // direction: 'horizontal',
    // loop: true,
    // loopFillGroupWithBlank: true,
    slidesPerView: 2,
    spaceBetween: 30,
    slidesPerGroup: 1,
    cssMode: true,

    navigation: {
        nextEl: '.swiper-button-next2',
        prevEl: '.swiper-button-prev2',
    },

    breakpoints: {
        500: {
            slidesPerView: 3,
            slidesPerGroup: 1,
        },
        915: {
            slidesPerView: 4,
            spaceBetween: 50,
            slidesPerGroup: 1,
        },
        1135: {
            slidesPerView: 5,
            slidesPerGroup: 1,
        }
    }
});

var swiper3 = new Swiper('.swiper-container3', {
    cssMode: true,
    navigation: {
        nextEl: '.swiper-button-next3',
        prevEl: '.swiper-button-prev3',
    },
    pagination: {
        el: '.swiper-pagination3',

    },
    mousewheel: true,
    keyboard: true,
});

var swiper4 = new Swiper('.swiper-container4', {
    cssMode: true,
    slidesPerView: 1,
    resistanceRatio: 2,
    pagination: {
        el: '.swiper-pagination4',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next4',
        prevEl: '.swiper-button-prev4',
    },

    breakpoints: {
        899: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        }
    }
});


document.querySelectorAll("button:not(.form-order)").forEach(item => {
    item.addEventListener('click', event => {
        showModal(document.querySelector(".modal-my1"))
    })
})

document.querySelectorAll("form").forEach(item => {
    item.addEventListener('submit', event => {
        showModal(document.querySelector(".modal-my2"));
        event.preventDefault();
        fetch("recall.html", {
            method: 'POST',
            body: new FormData(item)
        });
    })
})

document.querySelectorAll(".modal__wind").forEach(item => {
    item.addEventListener('click', event => {
        event.stopPropagation();
    })
})

document.querySelectorAll(".modal-my").forEach(item => {
    item.addEventListener('click', event => {
        hideModal(item);
    })
})


function hideModal(item) {
    item.style.opacity = '0';
    item.style.visibility = 'hidden';
}

function showModal(item) {
    item.style.visibility = 'visible';
    item.style.opacity = '1';
}

document.querySelectorAll("input[name = 'phone']").forEach(item => {
    item.addEventListener('keyup', event => {
        item.value = item.value.replace(/[^\d]/g, '');
        if (item.value.length >= 9) {
            document.querySelector('.drag-alarm').remove();
        }
    });
});

function checkValidBtn(data) {
    dataForm = data.dataset.form;
    data = dataForm.split(' ')
    form = document.getElementById(data[0])
    thisEl = document.getElementById(data[1])
    if (form.checkValidity() == false) {
        let p = document.createElement('p');
        p.className = "drag-alarm white-shadow";
        p.innerHTML = "<img src='img/dino.png' alt='done'> поле не может быть пустым";
        thisEl.after(p);
    }
    else {
        hideModal(document.querySelector(".modal-my"));
        document.querySelector('.drag-alarm').remove();
    }
}