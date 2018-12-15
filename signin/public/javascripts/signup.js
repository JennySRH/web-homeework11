$(function(){
    $('input:not(.button)').blur(function(){
        if(validator.isFieldValid(this.id,$(this).val())) {
            $(this).parent().find('.error').text('').hide();
        } else {
            $(this).parent().find('.error').text(validator.form[this.id].errorMessage).show();    
        }
    });

    $('input.button.submit').click(function() {
        $('input:not(.button)').blur();
        if(!validator.isFormValid()) {
            console.log(validator.form.username.status);
            console.log(validator.form.sid.status);
            console.log(validator.form.phone.status);
            console.log(validator.form.email.status);
            return false;
        }
    });
    $('input.button.reset').click(function() {
        $('.error').text('').hide();
    });

    

});