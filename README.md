jQuery EdiTableTable
=============

jQuery EdiTableTable is a simple plugin that creates a list of items with add/edit/delete capability. Just provide it with URLs for each of these actions, and you're good to go.
Depends on [underscore.js](http://documentcloud.github.com/underscore/) and looks much better with [Bootstrap](http://twitter.github.com/bootstrap/).

    $('#items').ediTableTable({
        // URL to POST data to create a new item. MUST return a JSON object containing an "id" field
        add_url: '/items/add',

        // URL to POST data to delete an item
        delete_url: '/items/delete',

        // URL to POST data to edit an existing item
        edit_url: '/items/edit'
    });

You can also supply the following parameters:

    $('#items').ediTableTable({
        // URL to POST data to create a new item. MUST return a JSON object containing an "id" field
        add_url: '/items/add',

        // additional data to be send in the POST request to add a new item
        data: { user_id: 1 }

        // URL to POST data to delete an item
        delete_url: '/items/delete',

        // URL to POST data to edit an existing item
        edit_url: '/items/edit',

        // text to be displayed on UI controls (e.g., "New Item")
        item_name: "Item",

        // array of objects to initialize the table with
        items: [{id: 1, value: "item 1"}, {id: 2, value: "item 2"}],

        // property of each item object containing the value of the item
        value_key: "value"
    });
