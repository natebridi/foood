$(document).ready(function () {	

	// auto adjust the height of textarea
	$(document).on( 'keyup', '.textarea-wrap textarea', function (){
	    $(this).height( 0 );
	    $(this).height( this.scrollHeight - 16 );
	});
	
	$('.fake-delete').on('click', function () {
		$('.delete-wrap').show();
	});
	$('.cancel').on('click', function () {
		$('.delete-wrap').hide();
	});

});

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function decodeHtml(text) {
  var map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };

  return text.replace(/\&amp;|\&lt;|\&gt;|\&quot;|\&#039;/g, function(m) { return map[m]; });
}

function changeRecipe () {
	var s = document.getElementById('recipeSelect');
	var id = s.options[s.selectedIndex].value;
	
	if (id != "") {
		window.location.href = "/admin/addedit.php?id=" + id;
	} else {
		window.location.href = "/admin/addedit.php";
	}
}
