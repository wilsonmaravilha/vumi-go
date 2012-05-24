$(document).ready(function() {
	$('#search-input').focus(function() {
		$('div#search').addClass('search-highlight');
		$('input#search-input').addClass('search-input-highlight')
	});
	$('#search-input').blur(function() {
		$('div#search').removeClass('search-highlight');
		$('input#search-input').removeClass('search-input-highlight')
	});
	$('#search-filter-input').focus(function() {
		$('#search-filter-input').addClass('search-filter-input-highlight');
		$('input#search-filter-input').val('');
		$('#search-filter').addClass('search-filter-highlight')
	});
	$('#search-filter-input').blur(function() {
		$('input#search-input').removeClass('search-filter-input-highlight');
		$('#search-filter').removeClass('search-filter-highlight')
	});
	$('#user').click(function() {
		$(this).hide();
		$('#user-fly').show()
	});
	$('#user-fly').mouseleave(function() {
		$(this).hide();
		$('#user').show()
	});
	$('#password-clear').show();
	$('#password-password').hide();
	$('#password-clear').focus(function() {
		$('#password-clear').hide();
		$('#password-password').show();
		$('#password-password').focus();
		$('#password-password').addClass('black')
	});
	$('#password-password').blur(function() {
		if ($('#password-password').val() == '') {
			$('#password-clear').show();
			$('#password-password').hide()
		}
		$('#password-password').removeClass('black')
	});
	$('#login-box #email').focus(function() {
		$('#login-box #email').val('');
		$('#login-box #email').addClass('black')
	});
	$('#login-box #email').blur(function() {
		if ($('#login-box #email').val() == '') {
			$('#login-box #email').val('Email Address')
		}
		$('#login-box #email').removeClass('black')
	});
	$('#forgot-box #email').focus(function() {
		$('#forgot-box #email').val('');
		$('#forgot-box #email').addClass('black')
	});
	$('#forgot-box #email').blur(function() {
		if ($('#forgot-box #email').val() == '') {
			$('#forgot-box #email').val('Email Address')
		}
		$('#forgot-box #email').removeClass('black')
	});
	$('#conv-message').keyup(function() {
		$('#preview-pane span.preview-message').text($('#conv-message').val());
		$('span.conv-message-count').text($('#conv-message').val().length);
		if ($('#conv-message').val().length > 140) {
			$('#valid-twitter').hide()
		} else {
			$('#valid-twitter').show()
		}
		if ($('#conv-message').val().length > 160) {
			$('#valid-sms').hide()
		} else {
			$('#valid-sms').show()
		}
	});
	(function($) {
		$.fn.clearTextLimit = function() {
			return this.each(function() {
				this.onkeydown = this.onkeyup = null
			})
		};
		$.fn.textLimit = function(limit, callback) {
			if (typeof callback !== 'function') var callback = function() {};
			return this.each(function() {
				this.limit = limit;
				this.callback = callback;
				this.onkeydown = this.onkeyup = function() {
					this.value = this.value.substr(0, this.limit);
					this.reached = this.limit - this.value.length;
					this.reached = (this.reached == 0) ? true : false;
					return this.callback(this.value.length, this.limit, this.reached)
				}
			})
		}
	})(jQuery);
	$('#conv-message').textLimit(300);
	$('#datepicker').datepicker({
		inline: true,
		minDate: 0
	});
	$('#dob').datepicker({
		inline: true,
		dateFormat: "yy-mm-dd"
	});
	$('#timepicker_1').timepicker();
	$('#form-filter li#more').click(function() {
		$('#more-form').show();
		$('#form-filter li#more').addClass('active');
		$('#form-filter li#basic').removeClass('active')
	});
	$('#form-filter li#basic').click(function() {
		$('#more-form').hide();
		$('#form-filter li#basic').addClass('active');
		$('#form-filter li#more').removeClass('active')
	});
    // No longer implementing this as javascript, separate HTML pages for now.
    // 
    // $('#form-filter li#upload').click(function() {
    //  $('#upload-form').show();
    //  $('#groups-list').hide();
    //  $('#form-filter li#upload').addClass('active');
    //  $('#form-filter li#groups').removeClass('active')
    // });
    // $('#form-filter li#groups').click(function() {
    //  $('#upload-form').hide();
    //  $('#groups-list').show();
    //  $('#form-filter li#groups').addClass('active');
    //  $('#form-filter li#upload').removeClass('active')
    // });
	$('.group-check').click(function() {
		$(this).parent(".group").toggleClass('selected')
	});
	$('.connection').mouseenter(function() {
		$(this).addClass('connection-over');
		$(this).find(".reply").show()
	});
	$('.connection').mouseleave(function() {
		$(this).removeClass('connection-over');
		$(this).find(".reply").hide()
	});
	$("#tabs").tabs();
	$('#new-group-button').click(function() {
		$('#new-group').slideToggle();
		$('#upload-contacts').hide()
	});
	$('#upload-contacts-button').click(function() {
		$('#upload-contacts').slideToggle();
		$('#new-group').hide()
	});
	$('#cancel-new-group').click(function() {
		$('#new-group').slideToggle()
	});
	$('#cancel-upload-contacts').click(function() {
		$('#google-docs-box').hide();
		$('#upload-form-box').hide();
		$('#upload-choose-box').show()
	});
	$('#cancel-google-upload').click(function() {
		$('#google-docs-box').hide();
		$('#upload-form-box').hide();
		$('#upload-choose-box').show()
	});
	$('#spreadsheet-method').click(function() {
		$('#upload-choose-box').hide();
		$('#upload-form-box').show()
	});
	$('#google-docs-method').click(function() {
		$('#upload-choose-box').hide();
		$('#google-docs-box').show()
	});
	$('form#sample-match select').change(function() {
		var currentSelect = ($(this).attr('name'));
		var currentVal = ($(this).val());
		$('form#sample-match select').each(function(index) {
			if ($(this).val() == currentVal && $(this).attr('name') != currentSelect) {
				alert("Already taken. Please choose another field");
				document.getElementById(currentSelect).selectedIndex = 0;
				return false
			}
		})
	});
	$('#conv-search-filter').click(function() {
		$('#people-search-result').hide();
		$('#help-search-result').hide();
		$('#conv-search-result').show();
		$(this).parent('div').addClass('groups-active');
		$('#help-search-filter').parent('div').removeClass('groups-active');
		$('#people-search-filter').parent('div').removeClass('groups-active')
	});
	$('#people-search-filter').click(function() {
		$('#people-search-result').show();
		$('#help-search-result').hide();
		$('#conv-search-result').hide();
		$(this).parent('div').addClass('groups-active');
		$('#conv-search-filter').parent('div').removeClass('groups-active');
		$('#help-search-filter').parent('div').removeClass('groups-active')
	});
	$('#help-search-filter').click(function() {
		$('#people-search-result').hide();
		$('#help-search-result').show();
		$('#conv-search-result').hide();
		$(this).parent('div').addClass('groups-active');
		$('#conv-search-filter').parent('div').removeClass('groups-active');
		$('#people-search-filter').parent('div').removeClass('groups-active')
	})
});