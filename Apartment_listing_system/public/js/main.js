
var image_remove = (file_name, obj) => {
	var listing_id = $("#listing_id").val();
	
	$.ajax({
		url: document.location.origin + '/apartment/delete_file',
		type: 'POST',
		data: {
			file_name: file_name,
			listing_id: listing_id
		},
		dataType: 'json',
		success: function(response) {
			if(response.flag) {
				var parent = $(obj).parent('.image_item_wrap');
				$(parent).remove();
				$("#" + file_name).remove();
			}
			else {
				alert(response.error);
			}
		}
	})
}


var reply_comment = (review_id) => {
	$("#commentModal #review_id").val(review_id);
	$("#commentModal").modal('toggle');
}

var full_search = (page, search_text, min_price, max_price, rating) => {
	$.ajax({
		type: 'GET',
		url: document.location.origin+'/',
		data: {
			flag: 'ajax',
			page: page,
			term: search_text,
			min_price: min_price,
			max_price: max_price,
			rating: rating,
		},
		dataType: 'html',
		success: function(response) {
			if(response) {
				$("#main_section").empty();
				$("#main_section").html(response);

				$(".apartment-carousel").owlCarousel({
					autoplay: false,
					dots: true,
					loop: true,
					items: 1
				});

				$(".blog-pagination .left_arrow").on('click', function() {
					if($(this).hasClass('disabled')) {
						return;
					}

					let current_page = $("#current_page").val();
					current_page--;
					
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			
				$(".blog-pagination .right_arrow").on('click', function() {
					if($(this).hasClass('disabled')) {
						return;
					}

					let current_page = $("#current_page").val();
					current_page++;
			
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			
				$(".blog-pagination .pagenation").on('click', function() {
					if($(this).hasClass('active')){
						return;
					}
			
					// $(".blog-pagination .pagenation.active").removeClass('active')
			
					let current_page = $(this).data('val');
					
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			
				$("#text_search_btn").on('click', function() {
					let current_page = $("#current_page").val();
			
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			
				$("#price_search_btn").on('click', function() {
					let current_page = $("#current_page").val();
			
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			
				$("[name = 'rating_search']").on('click', function(){
					let current_page = $("#current_page").val();
			
					let page = current_page;
					let search_text = $("#search_text").val();
					let min_price = $("#min_price").val();
					let max_price = $("#max_price").val();
					let rating = $("input[name='rating_search']:checked").val();
			
					full_search(page, search_text, min_price, max_price, rating);
				});
			}
		}
	})	
}

!(function ($) {
	"use strict";

	// Smooth scroll for the navigation menu and links with .scrollto classes
	var scrolltoOffset = $('#header').outerHeight() - 17;
	$(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto', function (e) {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			if (target.length) {
				e.preventDefault();

				var scrollto = target.offset().top - scrolltoOffset;

				if ($(this).attr("href") == '#header') {
					scrollto = 0;
				}

				$('html, body').animate({
					scrollTop: scrollto
				}, 1500, 'easeInOutExpo');

				if ($(this).parents('.nav-menu, .mobile-nav').length) {
					$('.nav-menu .active, .mobile-nav .active').removeClass('active');
					$(this).closest('li').addClass('active');
				}

				if ($('body').hasClass('mobile-nav-active')) {
					$('body').removeClass('mobile-nav-active');
					$('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
					$('.mobile-nav-overly').fadeOut();
				}
				return false;
			}
		}
	});

	// Activate smooth scroll on page load with hash links in the url
	$(document).ready(function () {
		if (window.location.hash) {
			var initial_nav = window.location.hash;
			if ($(initial_nav).length) {
				var scrollto = $(initial_nav).offset().top - scrolltoOffset;
				$('html, body').animate({
					scrollTop: scrollto
				}, 1500, 'easeInOutExpo');
			}
		}
	});

	// Mobile Navigation
	if ($('.nav-menu').length) {
		var $mobile_nav = $('.nav-menu').clone().prop({
			class: 'mobile-nav d-lg-none'
		});
		$('body').append($mobile_nav);
		$('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
		$('body').append('<div class="mobile-nav-overly"></div>');

		$(document).on('click', '.mobile-nav-toggle', function (e) {
			$('body').toggleClass('mobile-nav-active');
			$('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
			$('.mobile-nav-overly').toggle();
		});

		$(document).on('click', '.mobile-nav .drop-down > a', function (e) {
			e.preventDefault();
			$(this).next().slideToggle(300);
			$(this).parent().toggleClass('active');
		});

		$(document).click(function (e) {
			var container = $(".mobile-nav, .mobile-nav-toggle");
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				if ($('body').hasClass('mobile-nav-active')) {
					$('body').removeClass('mobile-nav-active');
					$('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
					$('.mobile-nav-overly').fadeOut();
				}
			}
		});
	} else if ($(".mobile-nav, .mobile-nav-toggle").length) {
		$(".mobile-nav, .mobile-nav-toggle").hide();
	}

	// Toggle .header-scrolled class to #header when page is scrolled
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#header').addClass('header-scrolled');
		} else {
			$('#header').removeClass('header-scrolled');
		}
	});

	if ($(window).scrollTop() > 100) {
		$('#header').addClass('header-scrolled');
	}

	// Intro carousel
	var heroCarousel = $("#heroCarousel");
	var heroCarouselIndicators = $("#hero-carousel-indicators");
	heroCarousel.find(".carousel-inner").children(".carousel-item").each(function (index) {
		(index === 0) ?
			heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "' class='active'></li>") :
			heroCarouselIndicators.append("<li data-target='#heroCarousel' data-slide-to='" + index + "'></li>");
	});

	heroCarousel.on('slid.bs.carousel', function (e) {
		$(this).find('h2').addClass('animate__animated animate__fadeInDown');
		$(this).find('p, .btn-get-started').addClass('animate__animated animate__fadeInUp');
	});

	$(".apartment-carousel").owlCarousel({
		autoplay: false,
		dots: false,
		loop: true,
		items: 1
	});

	$("#apartment-table").DataTable({
		// rowReorder: {
		// 	selector: 'td:nth-child(2)'
		// },
		order: [[ 0, "desc" ]],
		responsive: false,
		processing: false,
		fnRowCallback: function( nRow, aData, iDisplayIndex ) {
			var index = iDisplayIndex +1;
			$('td:eq(0)',nRow).html(index);
		},
		columnDefs: [{
			targets: 0,
			width: 50
		}, {
			"orderable": false,
			"render": function(data, type, row, rowIndex) {
				return `<a href="${document.location.origin}/apartment/edit/${row[0]}" class="edit btn btn-secondary btn-sm"">Edit</a>
				<a href="${document.location.origin}/apartment/delete/${row[0]}" class="delete btn btn-secondary btn-sm">Delete</a>`
			},
			'className': 'justify-content-center',
			"targets": -1
		}, {
			"orderable": false,
			"render": function(data, type, row, rowIndex) {
				if(data == 1) {
					return '<span>Contain</span>'
				}
				else {
					return '<span>Does Not Contain</span>'
				} 
			},
			"targets": 2
		}]
	});

	var map_obj = $("#apartment-map");
	if(map_obj.length > 0) {

		let lat = $("#latitude").val();
		let lng = $("#longitude").val();
		const myLatlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

		let map = new google.maps.Map(document.getElementById("apartment-map"), {
			zoom: 15,
			center: myLatlng,
		});

		let marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
		});
	}

	$(".blog-pagination .left_arrow").on('click', function() {
		if($(this).hasClass('disabled')) {
			return;
		}

		let current_page = $("#current_page").val();
		current_page--;
		
		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$(".blog-pagination .right_arrow").on('click', function() {
		if($(this).hasClass('disabled')) {
			return;
		}

		let current_page = $("#current_page").val();
		current_page++;

		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$(".blog-pagination .pagenation").on('click', function() {
		if($(this).hasClass('active')){
			return;
		}

		// $(".blog-pagination .pagenation.active").removeClass('active')

		let current_page = $(this).data('val');
		
		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$("#text_search_btn").on('click', function() {
		let current_page = $("#current_page").val();
	
		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$("#price_search_btn").on('click', function() {
		let current_page = $("#current_page").val();

		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$("[name = 'rating_search']").on('click', function(){
		let current_page = $("#current_page").val();

		let page = current_page;
		let search_text = $("#search_text").val();
		let min_price = $("#min_price").val();
		let max_price = $("#max_price").val();
		let rating = $("input[name='rating_search']:checked").val();

		full_search(page, search_text, min_price, max_price, rating);
	});

	$(window).on('load', function () {
		$('.paginate_button').attr('aria-label', 'My ARIA label');
		$('.blog-pagination a').attr('aria-label', 'My ARIA label');
	});

	$('#upload_avatar').attr('aria-label', 'My ARIA label');


})(jQuery);