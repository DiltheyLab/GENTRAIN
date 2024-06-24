var DB;


// ################################
// #          Entry point         #
// ################################

// Is called when the page is loaded
window.onload = function () {
    // redirect to /choose_data if no current DB exists
    redirect_if_no_db();
    DB = get_DB();

    // register all events / interactions on page
    register_events();

};

// ################################
// #   Page basic functionality   #
// ################################

function register_events() {
    // call needed general functions
    set_current_headerlink_active("#ref_exports");
    register_save_quit();

    // other interactions



}
