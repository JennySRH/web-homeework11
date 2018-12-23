$(function() {
    $('#signup').click(function() {
      window.location.href = '/regist'
    })
    $('#username').focus(function() {
        $('.error')[0].innerText = ''
        $('.error')[1].innerText = ''
    }) 
    $('#password').focus(function() {
        $('.error')[0].innerText = ''
        $('.error')[1].innerText = ''
    })
})
  
