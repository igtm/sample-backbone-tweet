$(function(){
var Post = Backbone.Model.extend({
	defaults: function(){
		var d = new Date();
		var date = d.getFullYear()+'/'+d.getMonth()+'/'+d.getDay()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
		return{
			order: posts.nextOrder(),
			name: "noname",
			tweet: "",
			created: date
		};
	},
	validate: function(attrs){
		if(_.isEmpty(attrs.name)) return '名前を記入して下さい';
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
		this.model.destroy();
	}
});


var AppView = Backbone.View.extend({
	el: $('#container'),
	events:{
		'keypress #tweet':'createTweet'
	},
	initialize: function(){
		this.listenTo(posts,'add',this.addTweet);
	},
	createTweet: function(e){
		if(e.keyCode != 13) {console.log('keypress'); return;}
		if(!this.$("#tweet").val()) {console.log('nai'); return;}
		posts.add({name: this.$("#name").val(),tweet: this.$("#tweet").val()},{validate:true});
		this.$("#tweet").val('');
	},
	addTweet: function(a){ //View#createTweet()->Collection#add->View #addTweet
		var view = new PostView({model:a});
		this.$("#tweets").append(view.render().el);
	}

});

var posts = new Posts();
var appview = new AppView();
});