(function($) {
	var GithubRepo = {

		init: function() {
            var github = {};
            github.parentContainer = $('.github-repos');
            github.formContainer = github.parentContainer.find('.form-container');
            github.repoContainer = github.parentContainer.find('.display-repos');            
            GithubRepo.bindEventHandlers(github);          
            
        },       
        bindEventHandlers: function(formdata){            
            $( '#fetch-repo').on('click', GithubRepo.fetchRepositories(formdata));            
        },
        fetchRepositories: function(formdata){
            return function(){                
                var repoInput = formdata.formContainer.find('#search-repos').val();
				formdata.parentContainer.find('.loader-icon').show();
                $.getJSON( "https://api.github.com/users/"+repoInput+"/repos", function( data ) {                                                        
                    GithubRepo.loadResponse(formdata, data);
                })                
                .fail(function() {
                    formdata.parentContainer.find('.loader-icon').hide();
                    formdata.repoContainer.show();
                    formdata.repoContainer.html("No repositories found");
                })                
            }
            
        },
		loadResponse: function(formdata,data){
			var repoInput = formdata.formContainer.find('#search-repos').val();
			formdata.repoContainer.html("");
			formdata.formContainer.find('#search-repos').val("");
			formdata.parentContainer.find('.loader-icon').hide();
			formdata.repoContainer.show();
			formdata.repoContainer.append("<h2>List of repositories in " + repoInput+"</h2>");
			formdata.repoContainer.append("<ul />");
			if(data.length > 0){
				$.each( data, function( key, value ) {
					formdata.repoContainer.find('ul').append('<li data-url='+value["url"]+'>'+value["name"]+'<input type="button" class="create-issue" value="New Issue" /></li>');
				});
			}
			else{
				formdata.repoContainer.html("No repositories found");
			}
			$( '.create-issue').on('click', function(){
				if($(this).closest('li').find('div').length == 0){
					GithubRepo.createIssue($(this),formdata);         
				}               
			});
		},
        createIssue: function(element, formdata){                       
            element.closest('li').append('<div class="create-issue-container"><div class="issue-header"><h3>Create Issue</h3><span class="close"></span></div><div class="content"><input type="text" class="issue-title" placeholder="Title" /><textarea type="text" class="issue-desc" placeholder="Description" ></textarea><input type="button" value="Submit" class="submit-issue" /></div></div>');
            $('.close').on('click',function(){
                GithubRepo.removeIssue($(this));
            });
            $( '.submit-issue').on('click', function(){
                var $this = $(this);
                var title = $this.closest('.create-issue-container').find('.issue-title').val();
                var desc =  $this.closest('.create-issue-container').find('.issue-desc').val();
                var issueUrl = $(this).closest('li').data("url");
                $.ajax({
                    url: issueUrl+'/issues',
                    type: 'POST',
                    dataType: 'json',  
					headers: {
					  Authorization: 'token 8c1fdf45450ff5f2e5a272013cc1ff8dda8cc26a'
					},					
                    data: JSON.stringify({
                      "title": title,
                      "body": desc
                    }),
                    success: function (response) {
                        $('.issue-header h3').html('Response');
                        $('.content').html('New issue registered successfully').css({'padding':'10px','color':'green'});
                    },
					error: function (error) {
                        $('.issue-header h3').html('Response');
                        $('.content').html('Error!!!').css({'padding':'10px','color':'red'});
                    }
                  });               
            });  
        },
        removeIssue: function(element){
            element.closest('.create-issue-container').remove();
        }
	}

	GithubRepo.init();
})(jQuery);