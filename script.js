$(document).ready(init); //when the page loads, we call the init

//we set up the data for the shopping list application
var items = [];

//the item prices and discounts
var info = {
  broccoli: { price: 30, discount: 0.1, isle: "Vegetables", delivery: true },
  carrots: { price: 26, discount: 0.2, isle: "Vegetables", delivery: true },
  coffee: { price: 23, discount: 0.05, isle: "Coffee_Tea", delivery: true },
  grapes: { price: 28, discount: 0.1, isle: "Fruits", delivery: true },
  meat: { price: 50, discount: 0.2, isle: "Deli", delivery: false },
  milk: { price: 12, discount: 0, isle: "Dairy", delivery: false },
  pasta: { price: 26, discount: 0.15, isle: "Grains", delivery: true },
  tomatoes: { price: 23, discount: 0.1, isle: "Vegetables", delivery: true },
  water: { price: 8, discount: 0.04, isle: "Beverages", delivery: true },
  chocolate: { price: 13, discount: 0, isle: "Candy", delivery: true },
  apple: { price: 17, discount: 0, isle: "Fruits", delivery: true },
  lettuce: { price: 23, discount: 0.05, isle: "Vegetables", delivery: false },
  donut: { price: 20, discount: 0.1, isle: "Candy", delivery: true },
  tea: { price: 15, discount: 0, isle: "Coffee_Tea", delivery: false },
};

//this function creates html for the items (including checkbox and label)

function init() {
  //this is an intialization function, which prepares the data for the application
  if (!localStorage.getItem("items_f2021")) {
    //if we cannot find the database named items_f2021
    localStorage.setItem("items_f2021", "[]"); //we create it, and give it an empty database
  }

  items = JSON.parse(localStorage.getItem("items_f2021")); //read the data from our database named as items_f2021, and then parse it so that we read it as an array

  //then generate the HTML
  generate_items();
}

function delete_item(item) {
  //this function is called when we click on the trash can
  var id = $(item).attr("data-item-id");
  items.splice(id, 1); //the splice function deletes one item at this ID
  localStorage.setItem("items_f2021", JSON.stringify(items)); //overwrite the database with the new data
  generate_items(); //refreshes the page
}

function change_status(checkbox) {
  //this function is called whenever we click on the checkbox
  var id = $(checkbox).attr("id"); //reading the checkbox ID
  var checked = $(checkbox).is(":checked"); //reading the status of the checkbox: true=if the checkbox is checked, false if the checkbox is unchecked
  items[id]["status"] = checked; //change the status of the item in the local data
  localStorage.setItem("items_f2021", JSON.stringify(items)); //overwrite the database with the new data
}

function generate_items() {
  var html = ""; //we define an html variable which stores the html code
  var id = 0; //we define a unique id for each item (id=1,2,3, etc.)
  var total_price = 0; //this is the total price
  for (var index in items) {
    //we are looping through the items
    var item_name = items[index]["name"]; //we extract the name
    var status = items[index]["status"]; //we read the status
    var checked_text = ""; //this is text that by default is empty, meaning the checkbox is not checked
    if (status) {
      //if the status is true
      checked_text = "checked";
    }
    var discount = info[item_name]["discount"]; //we extract the discount
    var item_price = info[item_name]["price"]; //we extract the price
    var isle = info[item_name]["isle"]; //we extract the isle
    item_price = item_price - discount * item_price; //we apply the discount
    var qty = items[index]["qty"]; //we extract the quantity
    var qty_text = ""; //this is the text that shows the quantity
    if (qty >= 2) {
      //if the quantity is greater than or equal to 2
      qty_text = "x " + qty; //shows the quantity like this x (and then the quantity)
    }
    var delivery = info[item_name]["delivery"]
      ? "</span> <img class='shopping-item-image' src='images/delivery.png'"
      : ""; //we extract the boolean that shows if the product is available for free delivery
    var organic =
      items[index]["type"] == "organic"
        ? "<img class='organic-img' src='images/organic_icon.png' style='width:20px'>"
        : ""; //we extract the type, and if it is "organic" we show the logo (raw apple)

    item_price *= qty;
    total_price += item_price; //add this price to the total
    //generate a checkbox and a label for each item, e.g. we create a label/checkbox for carrots, tomatoes, coffee
    html +=
      "<input " +
      checked_text +
      "  onclick='change_status(this);' type='checkbox' name='checkbox-v-2a' id='" +
      id +
      "'><label for='" +
      id +
      "'>" +
      item_name +
      " <span class='qty'>" +
      qty_text +
      "</span> <span class='price'>" +
      item_price.toFixed(2) +
      " AED</span>" +
      organic +
      " <img class='shopping-item-image' src='images/" +
      item_name +
      ".png'>" +
      delivery +
      "<span class='isle " +
      isle +
      "'>" +
      isle +
      "</span><i data-item-id='" +
      id +
      "' onclick='delete_item(this);' class='fa fa-trash'></i></label>";
    id += 1; //increment the id (meaning id intially is 0, then 1, then 2
  }

  $("#total_price").text(total_price.toFixed(2) + " AED");
  $("#shopping-list").html(html).trigger("create");
}

function add_item() {
  var new_item = $("#new_item").val(); //we read the new item value
  var qty = Number($("#new_qty").val()); //we read the quantity value
  var type = $("#new_type").val();
  //we need to add it to the array (items)
  items.push({ name: new_item, qty: qty, type: type, status: false });
  //to update my database, I call the localStorage.setItem
  localStorage.setItem("items_f2021", JSON.stringify(items));
  //call generate_items() which will read all the items, including the added items from the database,
  //and generate html for us
  generate_items();
}
