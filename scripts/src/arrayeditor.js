
var ArrayEditor = React.createClass({
	getInitialState: function () {
		return {
			array: JSON.parse(decodeHtml(this.props.data))
		}
	},
	componentDidMount: function () {
		$('.textarea-wrap').find( 'textarea' ).keyup();
	},
	encodeJson: function () {
		return escapeHtml(JSON.stringify(this.state.array));
	},
	updateArray: function (index, e) {
		var array = this.state.array;

		array[index] = e.target.value;

		this.setState({
			array: array
		});
	},
	removeItem: function (index) {
		var array = this.state.array;

		array.splice(index, 1);

		this.setState({
			array: array
		});
	},
	addItem: function () {
		var array = this.state.array;

		array.push('');

		this.setState({
			array: array
		});
	},
	render: function () {
		var inputs = this.state.array.map(function (item, index) {
			return <li>
				<span className="delete" onClick={this.removeItem.bind(this, index)}>&times;</span>
				<div className="textarea-wrap">
					<textarea value={item} key={index} onChange={this.updateArray.bind(this, index)} />
				</div>
			</li>;
		}, this);

		return <div className="steps">
			<ul>
				{inputs}
			</ul>
			<div className="add" onClick={this.addItem}>Add</div>
			<input type="hidden" name={this.props.name} value={this.encodeJson()} />
		</div>;
	}
});

$(document).ready(function () {
	$('[data-array]').each(function () {
		var data = $(this).attr('data-array') || '[""]',
			name = $(this).attr('data-name');
		React.render(<ArrayEditor data={data} name={name} />, this);
	});
});
