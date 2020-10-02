    function jivo_onLoadCallback(state) {
		if (document.location.hash && document.location.hash === '#jivo_open'){
			jivo_api.open();
		}
	} 

    $(document).ready(function() {
  


        var tariffs = $('.tariff-block');
        var isp_type = parseInt($.cookie('isp_type')) || 0;

		if (tariffs.length > 0){
			switch (isp_type) 
			{
				case 1:
					tariffs.css('visibility', 'hidden');  
					$('#popular').css('display', 'none');
					$('.tariff-block__orange').css('display', 'flex');
					tariffs.css('visibility', 'visible');
					break;
				  
				case 2:
					tariffs.css('visibility', 'hidden');  
					$('#popular').css('display', 'none');
					$('#two-item')[0].textContent = 'индивидуальная стоимость подключения'
					$('.tariff-block__orange').css('display', 'flex');
					tariffs.css('visibility', 'visible');
					break;
				  
				default:
					tariffs.css('visibility', 'visible');
					break;
			}
		}
		
		//Смена тарифов
		$('.kyiv-tr, .mrpl-tr').on('click', function(){
			if($(this).hasClass('kyiv-tr'))
			{
				$('.kyiv-tr').removeClass('active-city');
				$(this).addClass('active-city');
				$('.tariff-recommend-top .plan').each(function(index){
					if(index == 0 || index == 2 || index == 4)
						$(this).removeClass('dspno');
					else
						$(this).addClass('dspno');
				});
				
				$('.types-selector li').eq(1).css('display', 'inline-block');
				$('.trinity-man-block').css('display', 'block');
				$('.mrpl-tr').css('display', 'inline-block');
				$('.kyiv-tr').css('display', 'none');
				$('.no-kiev').css('display', 'table');
				$('.types-selector li').eq(0).find('a').trigger('click');
			}
			else if($(this).hasClass('mrpl-tr'))
			{
				$('.mrpl-tr').removeClass('active-city');
				$(this).addClass('active-city');
				$('.tariff-recommend-top .plan').each(function(index){
					if(index == 0 || index == 2 || index == 4)
						$(this).addClass('dspno');
					else
						$(this).removeClass('dspno');
				});
				$('.types-selector li').eq(1).css('display', 'none');
				$('.trinity-man-block, .no-kiev').css('display', 'none');
				$('.mrpl-tr').css('display', 'none');
				$('.kyiv-tr').css('display', 'inline-block');
				$('.yes-kiev').css('display', 'table');
				$('.types-selector li').eq(0).find('a').trigger('click');
			}
		});
		
		$('.tabs li a').on('click', function(){
			var bl_cont = $(this).attr('href');
			if($(this).attr('href') != '#')
			{
				if($('.kyiv-tr').is(':hidden'))
				{
					$(bl_cont).find('.wrap .pay_mob').each(function(){
						if(!$(this).hasClass('mrpl'))
							$(this).addClass('hiddenBlock');
						else if(!$(this).hasClass('kiev'))
							$(this).removeClass('hiddenBlock');
					});
					
					$(bl_cont).find('.wrap .info-trr').each(function(){
						if(!$(this).hasClass('mrpl'))
							$(this).addClass('hiddenBlock');
						else if(!$(this).hasClass('kiev'))
							$(this).removeClass('hiddenBlock');
					});
				}
				else if($('.mrpl-tr').is(':hidden'))
				{
					$(bl_cont).find('.wrap .pay_mob').each(function(){
						if(!$(this).hasClass('kiev'))
							$(this).addClass('hiddenBlock');
						else if(!$(this).hasClass('mrpl'))
							$(this).removeClass('hiddenBlock');
					});
					
					$(bl_cont).find('.wrap .info-trr').each(function(){
						if(!$(this).hasClass('kiev'))
							$(this).addClass('hiddenBlock');
						else if(!$(this).hasClass('mrpl'))
							$(this).removeClass('hiddenBlock');
					});
				}				
			}
		});

		/*$('#carousel-generic').carousel({
			pause: true,
			interval: 6000000
		});*/
		
		$('.all-info-btn').click(function(){
			$(this).parent().slideUp(110);
			$(this).parents('.row').find('.dspno2').slideDown(110);
		});
		
		$('.tongue span').on('click', function(){
			if($(this).parent().find('.sel-lang').is(':hidden'))
				$(this).parent().addClass('ton-act').find('.sel-lang').slideDown(150);
			else
				$(this).parent().removeClass('ton-act').find('.sel-lang').slideUp(150);
		});
		
        ////////////// Не удалять //////////////////
        var is_trinity;

        $.ajax({
            url: document.location
        }).done(function(data, textStatus, xhr) {
            is_trinity = xhr.getResponseHeader('x-our-client');
        });

        setTimeout(function() {
            $.cookie('is_trinity', is_trinity, { expires: 1 });
        }, 1000);
        ////////////// Не удалять //////////////////


        $("#callmeform").mask("+389999999999");
        var date = new Date().getDate();

        if (!$.cookie('contract') && date >= 27) { // Уведомление о оплате за следующий месяц
            if ($.cookie('notifybalance') !== 'true') { // Показываем сообщение раз в сутки.
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: 'checkbalance' },
                    dataType: 'json',
                    success: function(r) {
                        if (r.status === true) {
                            toastr.info(r.text, 'Внимание!', { timeOut: 15000 }); // Noty
                            $.cookie('notifybalance', 'true', { expires: 1 });
                        }
                    }
                });
            }
        }

        if (!$.cookie('contract')) { // Добавляем в cookie номер договора абонента.
            $.ajax({
                url: "/api.php",
                type: 'POST',
                data: { type: 'getcontract' },
                dataType: 'json',
                success: function(r) {
                    if (r.status === true) {
                        $.cookie('contract', r.uid, { expires: 30 });
                    }
                },
                error: function() {
                    $.cookie('contract', false, { expires: 1 });
                }
            });
        }




        $("#callme a").on('click', function() { // Перезвоните мне
            var tel = $("#callme input[name=callmeform]").val();

            event.preventDefault();
            if (tel === '+38' || tel === '') {
                toastr.error('Некорректный формат номера', 'Ошибка!', { timeOut: 5000 })
            } else {
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: 'recall', phone: tel },
                    dataType: 'json',
                    success: function(r) {
                        if (r.status === true) {
                            toastr.success('В ближайшее с вами свяжется специалист.', 'Успешно!', { timeOut: 5000 }); // Noty
                            $("#callme input[name=callmeform]").val(''); // Clear Form
                        } else {
                            toastr.error('Некорректный формат номера', 'Ошибка!', { timeOut: 5000 })
                        }
                    }
                });
            }
        });

        $("#subscribe a").on('click', function() { // Подписаться на рассылку email
            var email = $("#subscribe input[name=subscribeform]").val();
            event.preventDefault();

            if (email !== '') {
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: 'subscribe', email: email },
                    dataType: 'json',
                    success: function(r) {
                        if (r.status === true) {
                            toastr.success('Ваш e-mail успешно добавлен в рассылку.', 'Успешно!', { timeOut: 5000 }); // Noty
                            $("#subscribe input[name=subscribeform]").val(''); // Clear Form
                        } else {
                            toastr.error('Некорректный e-mail', 'Ошибка!', { timeOut: 5000 })
                        }
                    }
                });
            } else {
                toastr.error('Некорректный e-mail', 'Ошибка!', { timeOut: 5000 })
            }
        });
		
		$('.inextv4-btn button').on('click', function(){
			$('#feedback button').attr('data-type', $(this).data('type'))
		});

        $("#feedback #submit").on('click', function(event) { // Modal перезвоните мне.
            var name = $(this).parents('#feedback').find("#name").val();
            var phone = $(this).parents('#feedback').find("#callmeform").val();
            event.preventDefault();

            if (phone !== '') {
				var type = 'callme';
				if($(this).data('type') == 'orderTVBox')
					type = 'orderTVBox';
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: type, phone: phone },  //
                    dataType: 'json',
                    success: function(r) {
                         if (r.status === true) {
                             $("#feedback").empty();
                             $('.modal').modal('hide');
                             
                             //$('#callme').find(".login-window h2").html('В ближайшее время с вами свяжется наш оператор!'); //
							 if($('.prediction').length < 1){
							 	toastr.success('В ближайшее с вами свяжется специалист.', 'Успешно!', { timeOut: 5000 }); // Noty
							 	
							 	return $('#successModal').modal(); 
							 } else {
							 	$('.zidx, .wheel_content').fadeOut();
							 	$('.prediction_mask, .prediction_result, .call-pre').fadeIn();
							 }
							 $('.close-window').trigger('click');
                       }
                    }
                });
				$(this).removeData('type');
            } else {
                toastr.error('Не все поля заполнены.', 'Ошибка!', { timeOut: 5000 })
            }
        });

        if ($('#successModal').length && 'gtag' in window){
        	$('#successModal').on('shown.bs.modal', function () {
 				gtag('event', 'conversion', { 'send_to': 'AW-836409207/ZlpOCInJhtQBEPeu6o4D', 'transaction_id': '' });
 				console.log('gtag'); 
			})
    	}

        $("#getHD #submit").on('click', function(event) { // Modal подключить 50 HD каналов.
            var name = $("#name").val();
            var phone = $("#callmeform").val();
            event.preventDefault();

            if (phone !== '') {
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: 'getHD', phone: phone },  //
                    dataType: 'json',
                    success: function(r) {
                        if (r.status === true) {
                            $("#getHD").empty();
                            $("#getHD .login-window h2").empty().html('<h2><img src="https://www.mytrinity.com.ua/templates/Design/images/confirm.svg"><br><br><p>В ближайшее время с вами свяжется наш оператор</p></h2>'); //
                        }
                    }
                });
            } else {
                toastr.error('Не все поля заполнены.', 'Ошибка!', { timeOut: 5000 })
            }
        });

        $(".tariff-button button").on('click', function() { // При нажатии кнопки Заказать, берем данные из data-tariff и кладем в cookie
            $.cookie('order', $(this).attr("data-tariff"));
            document.location.href = '/order.html';
        });


        $("#isp-type-connect form").on('submit', function(e) { // При нажатии кнопки Заказать, берем данные из data-tariff и кладем в cookie
            var phone = $(this).find("input[type=tel]").val();

           if (phone !== '') {
                $.ajax({
                    url: "/api.php",
                    type: 'POST',
                    data: { type: 'callme', phone: phone, isp_type: !$.cookie('isp_type') || parseInt($.cookie('isp_type')) == 0 ? undefined : parseInt($.cookie('isp_type')) },  // is_type: !$.cookie('isp_type') || parseInt($.cookie('isp_type')) == 0 ? undefined : parseInt($.cookie('isp_type'))
                    dataType: 'json',
                    success: function(r) {
                        if (r.status === true) {
                            $("#ispform").empty();
                            $("#ispcontent").empty().html('<h2><img src="https://www.mytrinity.com.ua/templates/Design/images/confirm.svg"><br><br><p>В ближайшее время с вами свяжется наш оператор</p></h2>'); //
                        } else {
                            toastr.error('Неверный формат номера', 'Ошибка!', { timeOut: 5000 })
                        }
                    }
                });
            } else {
                toastr.error('Не все поля заполнены.', 'Ошибка!', { timeOut: 5000 })
            }
        

            return false;
        });


        $(".tech-footer button.button.button-tertiary").on('click', function() { // При нажатии кнопки Заказать, берем данные из DIV блока и кладем в cookie
            var pathname = location.pathname;

            function toJson() {
                var obj = {
                    name: title,
                    price: price,
                    sum: 1,
                    all: price,
                    img: image,
                    strong: strong
                };
				console.log(JSON.stringify(obj));
                return JSON.stringify(obj);
            }

            if ((pathname === '/') || (pathname === '/uk/') || (pathname === '/main-test.html') || (pathname === '/uk/main-test.html')) { // Выполняем только на главной
                var block,
                    title,
                    price,
                    image;

                block = $(this).parents('div').eq(1);
                title = block.find('.tech-title').text().replace(/\s+/g, ' ');
                price = block.find('.tech-price-now').text().replace(/\s+/g, ' ');
                image = $(this).parents('div').eq(2).find('.tech-image').find('img').attr('src');
                strong = block.find('strong').text().replace(/\s+/g, ' ');


                $.cookie('order', toJson());
				
                document.location.href = (pathname === '/uk/')?'/uk/order.html':'/order.html';
                toJson(); // Run
            } else {
                block = $(this).parents('div').eq(1);
                title = block.find('.tech-title').text().replace(/\s+/g, ' ');
                price = block.find('.tech-price-now').text().replace(/\s+/g, ' ');
                image = $(this).parents('div').eq(2).find('.tech-image').find('img').attr('src');
                strong = block.find('strong').text().replace(/\s+/g, ' ');
                orders.push(JSON.parse(toJson()));
                refresh();
            }
        });

		$('.mb-menu').on('click', function(){
			if($('.navigation-in').is(':visible'))
				$('.navigation-in').slideUp(200);
			else
				$('.navigation-in').slideDown(200);
		});
		
		$(window).resize(function() {
			if($(this).width()>1180)
				$('.navigation-in').removeAttr('style');
		});
		
		$('.spoiler-lis').on('click', function(){
			$('.spoiler-lis ul, .spoiler-lis table').slideUp(200);
			if($(this).find('ul').is(':visible') || $(this).find('table').is(':visible'))
				$(this).find('ul, table').slideUp(200);
			else
				$(this).find('ul, table').slideDown(200);
		});
    });

    function isScrolledIntoView(elem) { //Карусель стартует, когда становится видимой.
        var pathname = location.pathname;
        if (pathname === '/') {
            var docViewTop = $(window).scrollTop();
            var docViewBottom = docViewTop + $(window).height();

            var elemTop = $(elem).offset().top;
            var elemBottom = elemTop + $(elem).height();

            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        }
    }

    $(document).ready(function() {
        $('.carousel').removeAttr('data-ride');
    });
    var pathname = location.pathname;
    if (pathname === '/') {
        $(window).scroll(function() {

            if (isScrolledIntoView('.carousel') === true) {
                $('.carousel').attr('data-ride', 'carousel');
                $('.carousel').carousel('cycle');

            }


        });
    }