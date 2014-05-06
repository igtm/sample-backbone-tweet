$(function(){
	var Post = Backbone.Model.extend({
		defaults: function(){
			var d = new Date();
			var date = d.getFullYear()+'/'+d.getMonth()+'/'+d.getDay()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
			return{
				order: posts.nextOrder(),
				name: 'noname',
				tweet: '',
				created: date
			};
		},
		validate: function(attrs){
			if(_.isEmpty(attrs.name)) return '※ 名前を記入して下さい';
		}
	});


	var Posts = Backbone.Collection.extend({
		model: Post,
		nextOrder: function(){
			if(!this.length) return 1;
			return this.last().get('order') + 1;
		},
		comparator: function(){
			return this.get('order');
		}
	});

	var PostView = Backbone.View.extend({
		tagName: "li",
		className: 'tweet-list',
		template: _.template($('#temp-tweets').html()),
		initialize: function(){
			this.listenTo(this.model,'destroy',this.remove);
		},
		events: {
			'click .destroy': 'clear'
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clear: function(){
			console.log('Ⅰ．モデルを破壊');
			console.log('Ⅱ．ビューを消去');
			this.model.destroy();
		}
	});


	var AppView = Backbone.View.extend({
		el: $('#container'),
		events:{
			'keypress #tweet':'createTweet',
			'keypress #name':'errorDelete'
		},
		initialize: function(){
			this.listenTo(posts,'add',this.addTweet);
		},
		createTweet: function(e){ //Enterキーで作成！
			if(e.keyCode != 13) {return;} 
			if(!this.$("#tweet").val()) {return ;}

			var newModel = new Post();   console.log('１．空Model作成');
			this.listenTo(newModel,'invalid',this.errorDisp);    console.log('２，そのモデルがvalidateで弾かれた時のために監視開始');
			if(newModel.set({name: this.$('#name').val(),tweet: this.$('#tweet').val()},{validate:true})){　　console.log('３. 空モデルに入力内容を挿入');
				posts.add(newModel); console.log('４. うまく行ったので、コレクションに追加');
			}
			this.$('#tweet').val('');
		},
		errorDisp: function(model, error){ //名前が無いのでエラー
			$('#error').html(error);
			console.log('名前が無いのでエラー');
		},
		errorDelete: function(){ //エラー表示があるときだけ、それを消去
			if($('#error').html() == '')return ;
			console.log('=>Model#validate()で引っかかってエラー');
			$('#error').empty();
		},
		addTweet: function(a){ //View#createTweet()->Collection#add->View #addTweet
			var view = new PostView({model:a});
			this.$('#tweets').append(view.render().el);
		}

	});

	var posts = new Posts();
	var appview = new AppView();




	// introduction 
	console.log('＜オブジェクト一覧とインスタンス化状況＞');
	console.log('| View:       AppView - 空作成 ');
	console.log('| View:       PostView - ');
	console.log('| Collection: Posts - 空作成 ');
	console.log('| Model:      Post - ');

});