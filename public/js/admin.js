<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>User Management</title>
    <link rel="stylesheet" href="css/demo.css">
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="img/icon.jpg">

    <style>
        .filterable { margin-top: 15px; }
        .filterable .panel-heading .pull-right { margin-top: -20px; }
        .filterable .filters input[disabled] {
            background-color: transparent;
            border: none;
            cursor: auto;
            box-shadow: none;
            padding: 0;
            height: auto;
        }
        .filterable .filters input[disabled]::placeholder { color: #333; }

        .pagination {
        display: flex;
        justify-content: center;
        margin-top: 20px;
      }
      .pagination button {
        margin: 0 2px;
        padding: 5px 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        cursor: pointer;
      }
      .pagination button.active {
        background-color: #af007c;
        color: white;
      }
    </style>
</head>
<body>
    <header class="wrapper">
        <div>
            <a href="your_homepage_url">
                <img src="img/fives-logo-white3.png" alt="Your logo" height="50px" width="80px" id="top-left" />
            </a>
        </div>
        <nav class="logo" style="margin-top:-80px; margin-right: 60px;">
            <a class="dropdown-toggle" type="text" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Home <span class="caret"></span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="margin-top:-630px; margin-left: 1000px;">
                <li><a class="dropdown-item" href="/demo">Users</a></li>
                <li><a class="dropdown-item" href="/projects">Projects</a></li>
                <li><a class="dropdown-item" href="/progress">Progress</a></li>
            </ul>

            <!-- <a href="">MyProfile</a> -->
            <a href="/login">Logout</a>
        </nav>
    <center> <h4 style="margin-right:0px;margin-top:-50px; color: white;">ADMINISTRATOR</h4></center>

    </header>
    <div class="container">
        <div class="row clearfix">
            <div class="col-md-12 column">
                <div class="panel panel-primary filterable">
                    <div class="panel-heading" style="background-color:#af007c;">
                        <h3 class="panel-title">Users</h3>
                        <div class="pull-right">
                            <button id="add_row" class="btn btn-default pull-left" style="padding: 3px;margin-right:5px;">Add User</button>
                            <button class="btn btn-default btn-xs btn-filter">
                                <span class="glyphicon glyphicon-filter" style="padding: 5px; margin-left: 2PX;"></span>
                            </button>
                        </div>
                    </div>
                    <table class="table table-bordered table-hover" id="tab_logic">
                        <thead>
                            <tr class="filters">
                                <th><input type="text" class="form-control" placeholder="User ID" disabled name="user_id" /></th>
                                <th><input type="text" class="form-control" placeholder="User Name" disabled name="name"/></th>
                                <th><input type="email" class="form-control" placeholder="E Mail" disabled name="email"/></th>
                                <th><input type="text" class="form-control" placeholder="Designation" disabled name="Designation"/></th>
                                <th><input type="text" class="form-control" placeholder="Manager" disabled name="Manager"/></th>
                                <th><input type="text" class="form-control" placeholder="Status" disabled name="status" /></th>
                                <th><input type="text" class="form-control" placeholder="role" disabled name="role" /></th>
                                <th><input type="text" class="form-control" placeholder="Action" disabled /></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <!-- Pagination controls -->
                    
                </div>
            </div>
        </div>
    </div>

    
    
    <center>

    <div class="pagination">
        <button id="prevPage" style="padding: 7px;">Previous</button>
        <button id="nextPage"style="padding: 7px;">Next</button>
      </div></center>
    <footer>
        <div id="copyright">&#169 ALL RIGHTS RESERVED</div>
    </footer>

    <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="editModalLabel">Users</h4>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="form-group">
                            <label for="editUserId">User ID</label>
                            <input type="text" class="form-control" id="editUserId" name="user_id" readonly>
                        </div>
                        <div class="form-group">
                            <label for="editUserName">UserName</label>
                            <input type="text" class="form-control" id="editUserName" name="name">
                        </div>
                        <div class="form-group">
                            <label for="editUserEmail">Email</label>
                            <input type="email" class="form-control" id="editUserEmail" name="email">
                        </div>
                        <div class="form-group">
                            <label for="editUserDesignation">Designation</label>
                            <input type="text" class="form-control" id="editUserDesignation" name="Designation">
                        </div>
                        <div class="form-group">
                            <label for="editUserManager">Manager</label>
                            <input type="text" class="form-control" id="editUserManager" name="Manager">
                        </div>
                        <div class="form-group">
                            <label for="editUserStatus">Status</label>
                           
                            <select class="form-control" id="editUserStatus" name="status">
                          
                                <option value="2">In Active</option>
                                <option value="1">Active</option>
                                
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="editUserrole">role</label>
                            <select class="form-control" id="editUserrole" name="role">
                          
                                <option value="2">user</option>
                                <option value="1">admin</option>
                                
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="saveChanges">Save changes</button>
                </div>
            </div>
        </div>
    </div>


    <!-- Alert Modal -->
<div class="modal fade" id="alertModal" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="alertModalLabel">Notification</h4>
            </div>
            <div class="modal-body" id="alertMessage">
                <!-- Alert message will be inserted here -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

<!-- Confirmation Modal -->
<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="confirmModalLabel">Confirm Deletion</h4>
            </div>
            <div class="modal-body" id="confirmMessage">
                Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
            </div>
        </div>
    </div>
</div>


    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="js/admin.js"></script>
        
</body>
</html>