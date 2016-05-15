
var Cookbook = React.createClass({
	displayName: 'Cookbook',

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
			data: { "id": id },
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

			clearSearch = React.createElement('div', { className: 'clear', onClick: this.clearSearch });
		}

		var recipes = filteredRecipes.map(function (recipe, i) {
			return React.createElement(
				'li',
				{ key: i, onClick: this.pullCardOut.bind(null, recipe.id), className: recipe.class },
				React.createElement('span', { dangerouslySetInnerHTML: { __html: recipe.title } })
			);
		}, this);

		var recipeCard = [];

		if (!_.isEmpty(this.state.currentRecipe)) recipeCard = React.createElement(IndexCard, { recipe: this.state.currentRecipe, putCardAway: this.putCardAway });

		return React.createElement(
			'div',
			{ className: this.state.recipeOpen ? 'content-wrap open' : 'content-wrap' },
			React.createElement(
				'div',
				{ className: 'content-inner' },
				React.createElement(
					'div',
					{ className: 'menu-wrap' },
					React.createElement(
						'ul',
						{ className: 'controls' },
						React.createElement(
							'li',
							null,
							React.createElement(
								'i',
								null,
								'F'
							),
							React.createElement(
								'i',
								null,
								'o'
							),
							React.createElement(
								'i',
								null,
								'o'
							),
							React.createElement(
								'i',
								null,
								'o'
							),
							React.createElement(
								'i',
								null,
								'd'
							)
						),
						React.createElement(
							'li',
							{ className: this.state.query != '' ? 'active' : '' },
							React.createElement('input', { type: 'text', ref: 'search', placeholder: 'Search', value: this.state.query, onChange: this.doSearch }),
							clearSearch
						)
					),
					React.createElement(
						'ul',
						{ className: 'menu' },
						recipes
					)
				),
				React.createElement(
					'div',
					{ className: 'card-wrap' },
					recipeCard
				)
			)
		);
	}
});

var IndexCard = React.createClass({
	displayName: 'IndexCard',

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
				return React.createElement(Ingredient, { ingredient: ingredient, key: i });
			}, this);
		}

		if (recipe.steps) {
			steps = recipe.steps.map(function (step, i) {
				return React.createElement('li', { key: i, dangerouslySetInnerHTML: { __html: step } });
			}, this);
		}

		if (recipe.time && recipe.time.total) {
			timeTotal = React.createElement(
				'div',
				null,
				React.createElement(
					'em',
					null,
					'Time'
				),
				' ',
				recipe.time.total
			);
		}

		if (recipe.time && recipe.time.active) {
			timeActive = React.createElement(
				'div',
				null,
				React.createElement(
					'em',
					null,
					'Active'
				),
				' ',
				recipe.time.active
			);
		}

		if (recipe.source && recipe.source.url) {
			source = React.createElement(
				'a',
				{ href: recipe.source.url },
				recipe.source.name
			);
		} else if (recipe.source) {
			source = recipe.source.name;
		}

		var notes = [];
		if (recipe.notes) {
			notes = React.createElement(
				'div',
				{ className: 'notes' },
				React.createElement(
					'h4',
					null,
					'Notes'
				),
				React.createElement('p', { dangerouslySetInnerHTML: { __html: recipe.notes } })
			);
		}

		return React.createElement(
			'div',
			{ className: 'card-inner' },
			React.createElement(
				'div',
				{ className: 'title' },
				React.createElement('div', { className: 'close', onClick: this.putCardAway }),
				React.createElement('h1', { dangerouslySetInnerHTML: { __html: recipe.title } })
			),
			React.createElement(
				'div',
				{ className: 'card-content' },
				React.createElement(
					'ul',
					{ className: 'stats' },
					React.createElement(
						'li',
						{ className: 'servings' },
						React.createElement(
							'em',
							null,
							'Servings'
						),
						' ',
						recipe.servings
					),
					React.createElement(
						'li',
						null,
						React.createElement(
							'div',
							{ className: 'time' },
							timeTotal,
							timeActive
						)
					),
					React.createElement(
						'li',
						{ className: 'source' },
						React.createElement(
							'em',
							null,
							'Source'
						),
						' ',
						source
					)
				),
				React.createElement(
					'div',
					{ className: 'card-body' },
					React.createElement(
						'div',
						{ className: 'card-left' },
						React.createElement(
							'ul',
							{ className: 'ingredients' },
							ingredients
						)
					),
					React.createElement(
						'div',
						{ className: 'card-right' },
						React.createElement(
							'ol',
							{ className: 'steps' },
							steps
						),
						notes
					)
				)
			)
		);
	}
});

var Ingredient = React.createClass({
	displayName: 'Ingredient',

	render: function () {
		var ingredient = this.props.ingredient,
		    measure = [];

		if (ingredient.measure) {
			measure = ingredient.quantity > 1 ? React.createElement(
				'span',
				{ className: 'measure' },
				measures[ingredient.measure].plural
			) : React.createElement(
				'span',
				{ className: 'measure' },
				measures[ingredient.measure].full
			);
		}

		return React.createElement(
			'li',
			null,
			React.createElement('span', { className: 'quantity', dangerouslySetInnerHTML: {
					__html: replaceFractions(ingredient.quantity)
				} }),
			measure,
			React.createElement(
				'span',
				{ className: 'name' },
				ingredient.name
			),
			React.createElement(
				'span',
				{ className: 'preparation' },
				ingredient.preparation
			)
		);
	}
});

React.render(React.createElement(Cookbook, null), document.getElementById('cookbook'));

function replaceFractions(str) {
	var fraction = '';
	var number = parseInt(str, 10);
	var remainder = parseFloat(str) % 1; // numbers after decimal point

	switch (remainder) {
		case 0.5:
			fraction = '&frac12;';break;
		case 0.25:
			fraction = '&frac14;';break;
		case 0.75:
			fraction = '&frac34;';break;
		case 0.33:
			fraction = '&frac13;';break;
	}

	if (number) return number + ' ' + fraction;else return fraction;
}