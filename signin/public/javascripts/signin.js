$(function() {
    $('#signup').click(function() {
      window.location.href = '/regist'
    })
    $('#signinForm').submit(function() {         
    var inputs = $('input')
      if (checkEmpty()) {
        return true
      } else {
        return false
      }
    })
    $('#username').focus(function() {
      $('.error')[0].innerText = ''
    }) 
    $('#password').focus(function() {
      $('.error')[1].innerText = ''
    })
})
  
function checkEmpty() {
    var inputs = $('input')
    var errors = $('.error')
    if (inputs[0].value == "" || inputs[0].value == undefined) {
      errors[0].innerText = '请输入用户名'
      return false;
    }
    if (inputs[1].value == "" || inputs[1].value == undefined) {
      errors[1].innerText = '请输入密码'
      return false;
    }
    return true
  }