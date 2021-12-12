define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/lib/view/utils/dom-observer'
], function ($, getTotalsAction, customerData, domObserver) {
    domObserver.get('.input-text.qty', function(el){
        $(el).on('change', function() {
            ajaxSubmit();
        });
    });

    function addObserver() {
        $(".qty-inc").unbind('click').click(function(){
            if($(this).parents('.field.qty').find("input.input-text.qty").is(':enabled')){
                $(this).parents('.field.qty').find("input.input-text.qty").val((+$(this).parents('.field.qty').find("input.input-text.qty").val() + 1) || 0);
                $(this).parents('.field.qty').find("input.input-text.qty").trigger('change');
                $(this).focus();
            }
        });
        $(".qty-dec").unbind('click').click(function(){
            if($(this).parents('.field.qty').find("input.input-text.qty").is(':enabled')){
                $(this).parents('.field.qty').find("input.input-text.qty").val(($(this).parents('.field.qty').find("input.input-text.qty").val() - 1 > 0) ? ($(this).parents('.field.qty').find("input.input-text.qty").val() - 1) : 0);
                $(this).parents('.field.qty').find("input.input-text.qty").trigger('change');
                $(this).focus();
            }
        });
    }

    function ajaxSubmit() {
        var form = $('form#form-validate');
        $.ajax({
            url: form.attr('action'),
            data: form.serialize(),
            showLoader: true,
            success: function (res) {
                var parsedResponse = $.parseHTML(res);
                var result = $(parsedResponse).find("#form-validate");
                var sections = ['cart'];

                $("#form-validate").replaceWith(result);
                addObserver();

                // The mini cart reloading
                customerData.reload(sections, true);

                // The totals summary block reloading
                var deferred = $.Deferred();
                getTotalsAction([], deferred);
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                console.log(err.Message);
            }
        });
    }
});
