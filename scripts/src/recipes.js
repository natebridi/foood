
var Cookbook = React.createClass({
	getInitialState: function () {
		return {
			currentRecipe: {},
			recipeOpen: false,
			query: '',
			recipes: []
		};
	},		
	componentDidMount: function () {
		var _this = this;
		
		$.ajax({
			url: '/fetch/list.php',
			success: function (recipes) {

				var parsed = JSON.parse(recipes),
				    count = 1;
				    
				_.each(parsed, function (recipe, index) {
					parsed[index].class = 'style-' + count;
					count++;
					if (count == 8) count = 1;
				});
				
				_this.setState({
					recipes: parsed
				});
			}
		});
	},
	pullCardOut: function (id) {
		var _this = this;	
	
		$.ajax({
			url: '/fetch/recipe.php',
			data: { "id" : id },
			success: function (recipe) {
				_this.setState({
					recipeOpen: true,
					currentRecipe: JSON.parse(recipe)
				});
			}
		});
	},
	putCardAway: function () {
		this.setState({
			recipeOpen: false
		});
	},
	doSearch: function (e) {	
		this.setState({
			query: e.target.value
		});
	},
	clearSearch: function () {
		this.setState({
			query: ''
		});
	},
	render: function () {	
		var filteredRecipes = this.state.recipes,
			clearSearch = [];
		
		if (this.state.query) {
			filteredRecipes = _.filter(filteredRecipes, function (recipe) {
				return recipe.title.toLowerCase().indexOf(this.state.query.toLowerCase()) != -1;
			}, this);
			
			clearSearch = <div className="clear" onClick={this.clearSearch}></div>;
		}
		
		var recipes = filteredRecipes.map(function (recipe, i) {
			return <li key={i} onClick={this.pullCardOut.bind(null, recipe.id)} className={recipe.class}><span dangerouslySetInnerHTML={{__html: recipe.title}}></span></li>;
		}, this);
		
		var recipeCard = [];
		
		if (!_.isEmpty(this.state.currentRecipe))
			recipeCard = <IndexCard recipe={this.state.currentRecipe} putCardAway={this.putCardAway} />;
	
		return 	<div className={(this.state.recipeOpen) ? 'content-wrap open' : 'content-wrap'}>
			<div className="content-inner">
				<div className="menu-wrap">
					<ul className="controls">
						<li><i>F</i><i>o</i><i>o</i><i>o</i><i>d</i></li>
						<li className={(this.state.query != '') ? 'active' : ''}>
							<input type="text" ref="search" placeholder="Search" value={this.state.query} onChange={this.doSearch} />
							{clearSearch}
						</li>
					</ul>
					<ul className="menu">
						{recipes}
					</ul>
				</div>
				<div className="card-wrap">
					{recipeCard}
				</div>
			</div>
		</div>;
	}
});

var IndexCard = React.createClass({
	putCardAway: function () {
		this.props.putCardAway();
	},
	render: function () {
		var recipe = this.props.recipe;
						
		var ingredients = [],
			timeActive = [],
			timeTotal = [],
			steps = [],
			source = [];
		
		if (recipe.ingredients) {
			ingredients = recipe.ingredients.map(function (ingredient, i) {
				return <Ingredient ingredient={ingredient} key={i} />;
			}, this);
		}
		
		if (recipe.steps) {
			steps = recipe.steps.map(function (step, i) {
				return <li key={i} dangerouslySetInnerHTML={{__html: step}}></li>;
			}, this);
		}
		
		if (recipe.time && recipe.time.total) {
			timeTotal = <div><em>Time</em> {recipe.time.total}</div>;
		}
		
		if (recipe.time && recipe.time.active) {
			timeActive = <div><em>Active</em> {recipe.time.active}</div>;
		}
		
		if (recipe.source && recipe.source.url) {
			source = <a href={recipe.source.url}>{recipe.source.name}</a>;	
		} else if (recipe.source) {
			source = recipe.source.name;
		}
		
		var notes = [];
		if (recipe.notes) {
			notes = <div className="notes">
						<h4>Notes</h4>
						<p dangerouslySetInnerHTML={{__html: recipe.notes}}></p>
					</div>;
		}
	
		return <div className="card-inner">
			<div className="title">
				<div className="close" onClick={this.putCardAway}></div>
				<h1 dangerouslySetInnerHTML={{__html: recipe.title}}></h1>
			</div>
			<div className="card-content">
				<ul className="stats">
					<li className="servings"><em>Servings</em> {recipe.servings}</li>
					<li><div className="time">{timeTotal}{timeActive}</div></li>
					<li className="source"><em>Source</em> {source}</li>
				</ul>
				<div className="card-inner">
					<div className="card-left">
						<ul className="ingredients">{ingredients}</ul>
					</div>
					<div className="card-right">
						<ol className="steps">{steps}</ol>
						{notes}
					</div>
				</div>
			</div>
		</div>;
	}
});

var Ingredient = React.createClass({
	render: function () {
		var ingredient = this.props.ingredient,
			measure = [];
		
		if (ingredient.measure) {
			measure = (ingredient.quantity > 1) ? 
				<span className="measure">{measures[ingredient.measure].plural}</span> :
				<span className="measure">{measures[ingredient.measure].full}</span>;
		}
		
		return <li>
			<span className="quantity" dangerouslySetInnerHTML={{
            	__html: replaceFractions(ingredient.quantity)
          	}}></span> 
			{measure} 
			<span className="name">{ingredient.name}</span>
			<span className="preparation">{ingredient.preparation}</span>
		</li>;
	}
});

React.render(
	<Cookbook />,
	document.getElementById('cookbook')
);

function replaceFractions(str) {
	var fraction = '';
	var number = parseInt(str, 10);
	var remainder = parseFloat(str) % 1; // numbers after decimal point
	
	switch(remainder) {
		case 0.5: fraction = '&frac12;'; break;
		case 0.25: fraction = '&frac14;'; break;
		case 0.75: fraction = '&frac34;'; break;
		case 0.33: fraction = '&frac13;'; break;
	}
	
	if (number)
		return number + ' ' + fraction;
	else
		return fraction;
}
