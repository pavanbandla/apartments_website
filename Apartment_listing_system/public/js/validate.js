
!(function ($) {
	"use strict";

	$('form.submit-form').submit(function (e) {
		e.preventDefault();

		var f = $(this).find('.form-group'),
			ferror = false,
			emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

		f.children('input').each(function () { // run all inputs

			var i = $(this); // current input
			var rule = i.attr('data-rule');

			if (rule !== undefined) {
				var ierror = false; // error flag for current input
				var pos = rule.indexOf(':', 0);
				if (pos >= 0) {
					var exp = rule.substr(pos + 1, rule.length);
					rule = rule.substr(0, pos);
				} else {
					rule = rule.substr(pos + 1, rule.length);
				}

				switch (rule) {
					case 'required':
						if (i.val() === '') {
							ferror = ierror = true;
						}
						break;

					case 'minlen':
						if (i.val().length < parseInt(exp)) {
							ferror = ierror = true;
						}
						break;
					case 'equalTo':
						if (i.val() != $('#'+ exp).val()) {
							ferror = ierror = true;
						}
						break;


					case 'email':
						if (!emailExp.test(i.val())) {
							ferror = ierror = true;
						}
						break;

					case 'checked':
						if (!i.is(':checked')) {
							ferror = ierror = true;
						}
						break;

					case 'regexp':
						exp = new RegExp(exp);
						if (!exp.test(i.val())) {
							ferror = ierror = true;
						}
						break;
				}
				i.next('.validate').html((ierror ? (i.attr('data-msg') !== undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
			}
		});

		f.children('textarea').each(function () { // run all inputs

			var i = $(this); // current input
			var rule = i.attr('data-rule');

			if (rule !== undefined) {
				var ierror = false; // error flag for current input
				var pos = rule.indexOf(':', 0);
				if (pos >= 0) {
					var exp = rule.substr(pos + 1, rule.length);
					rule = rule.substr(0, pos);
				} else {
					rule = rule.substr(pos + 1, rule.length);
				}

				switch (rule) {
					case 'required':
						if (i.val() === '') {
							ferror = ierror = true;
						}
						break;

					case 'minlen':
						if (i.val().length < parseInt(exp)) {
							ferror = ierror = true;
						}
						break;
				}
				i.next('.validate').html((ierror ? (i.attr('data-msg') != undefined ? i.attr('data-msg') : 'wrong Input') : '')).show('blind');
			}
		});

		if (ferror) return false;

		var this_form = $(this);
		var obj_id = $(this).attr('id');
		var action = $(this).attr('action');

		if (!action) {
			this_form.find('.loading').slideUp();
			this_form.find('.error-message').slideDown().html('The form action property is not set!');
			return false;
		}

		this_form.find('.sent-message').slideUp();
		this_form.find('.error-message').slideUp();
		this_form.find('.loading').slideDown();

		if ($(this).data('recaptcha-site-key')) {
			var recaptcha_site_key = $(this).data('recaptcha-site-key');
			grecaptcha.ready(function () {
				grecaptcha.execute(recaptcha_site_key, { action: 'php_email_form_submit' }).then(function (token) {
					form_submit(this_form, action, this_form.serialize() + '&recaptcha-response=' + token, obj_id);
				});
			});
		} else {
			form_submit(this_form, action, this_form.serialize(), obj_id);
		}

		return true;
	});

	function form_submit(this_form, action, data, obj_id) {
		$.ajax({
			type: "POST",
			url: action,
			data: data,
			dataType: 'json',
			timeout: 40000
		}).done(function (result) {
			console.log(result);
			if (result.flag == true) {
				this_form.find('.loading').slideUp();
				this_form.find('.sent-message').slideUp();
				this_form.find("input:not(input[type=submit]), textarea").val('');
				if(obj_id == 'signin_form') {
					if(result.account_type == 1) {
						document.location.href = document.location.origin+'/'
					}
					else {
						document.location.href = document.location.origin+'/apartment'
					}
				}
				else if(obj_id == 'signup_form') {
					document.location.href = document.location.origin+'/signin'
				}
				else if(obj_id == 'apartment_form') {
					document.location.href = document.location.origin+'/apartment'
				}
				else if(obj_id == 'review_form') {
					location.reload();
				}
				else if(obj_id == 'profile_form' || obj_id == 'password_form') {
					document.location.href = document.location.origin+'/profile'
				}
				else {
					location.reload();
					$("#commentModal").modal('hide');
				}

			} else {
				let msg = result.msg;
				this_form.find('.loading').slideUp();
				if (!msg) {
					msg = 'Form submission failed and no error message returned from: ' + action + '<br>';
				}
				this_form.find('.error-message').slideDown().html(msg);
			}
		}).fail(function (data) {
			console.log(data);
			var error_msg = "Form submission failed!<br>";
			if (data.statusText || data.status) {
				error_msg += 'Status:';
				if (data.statusText) {
					error_msg += ' ' + data.statusText;
				}
				if (data.status) {
					error_msg += ' ' + data.status;
				}
				error_msg += '<br>';
			}
			if (data.responseText) {
				error_msg += data.responseText;
			}
			this_form.find('.loading').slideUp();
			this_form.find('.error-message').slideDown().html(error_msg);
		});
	}

	$("form.upload-form").submit(function(e) {
		e.preventDefault();

		var action = $(this).attr('action');

		var formData = new FormData();
		if($('#file').length == 0)
			return;

		formData.append('file', $('#file')[0].files[0]);
		
		$.ajax({
			url : action,
			type : 'POST',
			data : formData,
			processData: false,  // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set contentType
			dataType: 'json',
			success : function(data) {
				if(!data.flag) {
					$('.upload-form #message-box').html(data.message);
					setTimeout(function(){
						$('.upload-form #message-box').empty();
					}, 3000);
				} else {
					var img_html = `<div class="image_item_wrap" style="margin-bottom: 20px;">
						<span class="image-close" onclick="image_remove('${ data.file_name }', this)"><i class="icofont-close"></i></span>
						<img src="/uploads/${ data.file_name }" style="width: 150px; height: 150px;" class="img-thumbnail"/>
						</div>`;
					$("#image_display_wrapper").prepend(img_html);
					var hidden_html = `<input type="hidden" id="${data.file_name}" name="file_name[]" value="${data.file_name}">`;
					$("#photo_hidden_wrapper").prepend(hidden_html);
				}
			}
		});	
	});

	$("#avatar_form").submit(function(e) {
		e.preventDefault();

		var action = $(this).attr('action');

		var formData = new FormData();
		if($('#profile_picture_file').length == 0)
			return;

		formData.append('file', $('#profile_picture_file')[0].files[0]);
		
		$.ajax({
			url : action,
			type : 'POST',
			data : formData,
			processData: false,  // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set contentType
			dataType: 'json',
			success : function(data) {
				if(!data.flag) {
					$('#avatar_form #message-box').html(data.message);
					setTimeout(function(){
						$('#avatar_form #message-box').empty();
					}, 3000);
				} else {
					var img_html = `<img src="/avatar/${data.profile_picture}" class="img-fluid" alt="" style="width: 150px; height: 150px;">`;
					$(".member .pic").empty().html(img_html);
					$("#profile_picture_path").val(data.profile_picture);
				}
			}
		});	
	})

})(jQuery);
