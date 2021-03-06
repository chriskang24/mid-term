$(document).ready(function() {
  //-----------------------------Navbar component------------------------------------------------------




  //--------------------------------Order table rendering logic ---------------------------------------
  const orderIdHelper = function(rows) {
    let menuEntries = "";

    for (let row of rows) {
      let time = row.order_time;
      time = time.substr(11, 5);
      menuEntries += `
        <tr id="picked:${row.id}">
          <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.order_id}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${row.name}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${row.email}</td>
          <td class="px-6 py-4 whitespace-nowrap"> ${time}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button onclick="smsID(${row.telephone}, ${row.id})" id="ready:${row.id}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              SMS
            </button>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <button onclick="orderCompleted(${row.order_id})"  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Remove from queue
            </button>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button onclick="orderDetail(${row.order_id})"  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Order Details
          </button>
          </td>
        </tr>
      `;
    }
    return menuEntries;
  };

  //Render a table with all curent orders
  const renderOrders = function() {
    $.get("/admin/order", function(data, status) {
      const orderItems = data.data.rows;
      let $body = `
      <div class="flex flex-col pt-5 center-table">
        <div class="">
          <div class="py-2 align-middle inline-block w-4/5 sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client name
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      client email
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order time
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order is ready
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order is picked up
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    ${orderIdHelper(orderItems)}
                  <!-- More items... -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>`;
      $(".owner-body").prepend($body);
    });
  };

//--------------------------------Add items to the menu feature--------------------------------------------------

window.submitNewItem = function() {
  $("#new-item-form").submit(function(event){
    event.preventDefault();
    const formContent = $(this).serialize();
    $.ajax({
      url: "/admin/menu/add",
      method: 'POST',
      data: formContent,
      success: function(result) {
        $(".owner-body ").empty();
      },
      error: function(error) {
      }
    });
  })
}

const newMenuItem = function() {
  const $newMenuItemForm = `
    <div class=" flex items-center justify-center">
          <form id="new-item-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <br>
              <h1 class="block text-gray-700 font-bold mb-2 text-xl text-center">Create New Menu Element</h1>
              <br>
              <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
                      Name
                  </label>
                  <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="name" id="name" type="text" placeholder="Name of the plate or product" required>
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
                      Price
                  </label>
                  <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="price" id="price" type="number" placeholder="Price" required>
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="prep">
                      Estimated time to prep
                  </label>
                  <input
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="prep" id="prep" type="number" placeholder="Preparation time in minutes" required>
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2" for="type">
                      Type of the Element
                  </label>
                    <select name="type" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="options-menu" aria-haspopup="true" aria-expanded="true">
                      <option value="entry">entry</option>
                      <option value="main">main</option>
                      <option value="dessert">dessert</option>
                      <option value="wine">wine</option>
                    </select>
              </div>
              <div class="flex items-center justify-between">
                  <button
                      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit">
                      Add New Element
                  </button>
              </div>
              <div class="mb-4">
          </form>
      </div>
      <script>submitNewItem();</script>
  `
  $(".owner-body").prepend($newMenuItemForm);
}

//----------------------------------------------Edit menu logic ---------------------------------------------------------
const statusButton = function(status) {
  if (status) {
    return `
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        On menu
      </button>`
  }
  if(!status)
  {
    return `
      <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Not on menu
      </button>`
  }
}

window.setActive = function(id, button) {
  $.post("/menu/" + id, function(data, status) {
  })
  button.parentElement.parentElement.querySelector('.status').innerHTML =statusButton(true)
}

window.setInActive = function(id, button) {
  $.post("/menu/disable/" + id, function(data, status) {
  })
  button.parentElement.parentElement.querySelector('.status').innerHTML =statusButton(false)
}

const editMenuHelper = function(id) {
  let menuEntries = "";
  for (let row of id) {
    menuEntries += `
    <tr id="picked:${row.id}">
      <td class="px-6 py-4 text-center whitespace-nowrap"> ${row.id}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.name}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.price}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.prep_time}</td>
      <td class="px-6 py-4 whitespace-nowrap"> ${row.type_plate}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="setActive(${row.id},this)" class="menu-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          ADD
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="setInActive(${row.id},this)"  class="menu-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Remove
        </button>
      </td>
      <td class="status px-6 py-4 whitespace-nowrap">
       ${statusButton(row.is_active)}
      </td>
    </tr>
  ` };
  return menuEntries;
}

window.renderEditMenu = function() {
  $.get("/menu/all", function(data, status){
    menuItems = data.data.rows
  const $body = `
    <div class="flex flex-col pt-5 pl-5 pr-5 rounded">
      <div class="center-table">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prep Time
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Add to Menu
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remove from Menu
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                  ${editMenuHelper(menuItems)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    `;
    $(".owner-body").prepend($body);
  })
}

  //---------------------------- Body management -----------------------------------------------------------------
  const clearBody = function() {
    $(".owner-body ").empty();
  };

  const showOrder = function() {
    $("#show-order").click(function() {
      clearBody();
      renderOrders();
    })
  }

  const editMenu = function() {
    $("#edit-menu").click(function() {
      clearBody();
      renderEditMenu();
    })
  }

  const addMenu = function() {
    $("#add-menu").click(function() {
      clearBody();
      newMenuItem();
    })
  }
  window.cancelItem = function(id) {
    console.log(id)
    $.ajax({
      url: `/order/item/${id}`,
      method: 'POST',
      success: function(result) {
      }
    })
  }


  $(document).ready(function() {
    const logoutButton = document.getElementById("button-logout");
    $(logoutButton).on('click', function () {
      alert("Handle for logout called");
      $.ajax({
        url: '/logout',
        method: 'POST',
        success: function(result) {
          console.log(result);
          location.reload();
        }
      })
    })
  })
  //--------------------------Function calling -----------------------------------

  addMenu();
  editMenu();
  showOrder();
  renderOrders();

});



