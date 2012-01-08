(function($) {
	$.fn.ediTableTable = function(options) {
		// define default options
		options = $.extend({
			data: {},
			items: [],
			item_name: 'Item',
			value_key: 'value'
		}, options);

		// make sure required parameters are present
		if (!options.add_url)
			throw "EdiTableTable Exception: You must supply an add_url!";
		if (!options.delete_url)
			throw "EdiTableTable Exception: You must supply a delete_url";
		if (!options.edit_url)
			throw "EdiTableTable Exception: You must supply an edit_url!";

		var t = this;
		var template_html = {
			container: ' \
				<div class="editable-container"> \
					<table class="bordered zebra-striped editable-items"> \
					<% for (var i in options.items) { %> \
						<%= templates.row({ item: options.items[i], options: options }) %> \
					<% } %> \
					</table> \
					<button id="btn-new" class="btn primary large btn-new">New <%= options.item_name %></button> \
					<div class="new-controls"> \
						<input class="txt-new" /> \
						<button class="btn primary btn-new-submit">Create <%= options.item_name %></button> \
					</div> \
				</div>',

			row: ' \
				<tr> \
					<td> \
						<span class="item-name" data-item-id="<%= item.id %>"><%= item[options.value_key] %></span> \
						<div class="hover-controls"> \
							<button class="btn primary btn-save">Save</button> \
							<button class="btn secondary btn-edit">Edit</button> \
							<button class="btn error btn-delete">Delete</button> \
						</div> \
					</td> \
				</tr>'
		};

		/**
		 * Add a new item by sending it to the add_url and adding it to the table
		 * @param value String value of new item
		 *
		 */
		function add_item(value) {
			var o = options.data;
			o[options.value_key] = value;

			$.post(options.add_url, o, function(response) {
				response = JSON.parse(response);

				// add row to table
				t.find('table').append(templates.row({
					item: { id: response.id, name: value },
					options: options
				}));

				// restore new item button
				t.find('.txt-new').val('');
				t.find('.new-controls').hide();
				t.find('.btn-new').fadeIn('fast');
			});
		}

		/**
		 * Edit an existing item by sending it to the edit_url and changing the table
		 * @param item DOM element representing the item's table cell
		 *
		 */
		function edit_item(item) {
			var value = $(item).find('input').val();
			var o = { id: $(item).data('item-id') };
			o[options.value_key] = value;

			// send data to server
			$.post(options.edit_url, o, function(response) {
				$(item).html(value).css({ padding: '5px' }).find('input').hide();
				$(item).parent().find('.btn-save').hide();
				$(item).parent().find('.btn-edit').show();
			});
		}

		// edit button click
		this.on('click.editableTable', '.editable-items .btn-edit', function() {
			var item = $(this).parent().siblings('.item-name');

			// replace item with text field and edit with save
			$(item).html('<input value="' + $(item).text() + '" />').css({ padding: 0 });
			$(item).parent().find('.btn-save').show();
			$(item).parent().find('.btn-edit').hide();
		});

		// double click on item name
		this.on('dblclick.editableTable', '.editable-items .item-name', function() {
			// replace item with text field and edit with save
			$(this).html('<input value="' + $(this).text() + '" />').css({ padding: 0 });
			$(this).find('.btn-save').show();
			$(this).find('.btn-edit').hide();
		});

		// delete button click
		this.on('click.editableTable', '.editable-items .btn-delete', function() {
			var item = $(this).parent().siblings('.item-name');

			$.post(options.delete_url, { 
				id: $(item).data('item-id')
			}, function(response) {
				// remove row from table
				$(item).parents('tr').fadeOut('fast', function() { $(this).remove(); });
			});
		});

		// save button click
		this.on('click.editableTable', '.editable-items .btn-save', function() {
			save_label($(this).parent().siblings('.item-name'));
		});

		// enter in edit input also edits item
		this.on('keypress.editableTable', '.editable-items input', function(e) {
			if (e.which == 13)
				edit_item($(this).parent());
		});

		// new button click
		this.on('click.editableTable', '.btn-new', function() {
			$(this).hide();
			$(this).siblings('.new-controls').fadeIn('fast');
		});

		// new submit button click
		this.on('click.editableTable', '.btn-new-submit', function() {
			add_item($(this).siblings('.txt-new').val());
		});

		// enter in new input also adds item
		this.on('keypress.editableTable', '.new-controls input', function(e) {
			if (e.which == 13)
				add_item($(this).val());
		});

		// compile templates
		var templates = {};
		for (var i in template_html)
			templates[i] = _.template(template_html[i]);

		// add table to container
		this.append(templates.container({ 
			options: options,
			templates: templates
		}));

		return this;
	};
})(jQuery);
