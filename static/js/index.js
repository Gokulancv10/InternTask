

function paginationUrl(){
	var href = new URL(window.location.href)
	href.searchParam.set('upcoming',value)
	href.searchParam.set('completed',value)
	window.location.href = href.toString()
}
