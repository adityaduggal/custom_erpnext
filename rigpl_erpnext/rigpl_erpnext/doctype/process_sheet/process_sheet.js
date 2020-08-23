// Copyright (c) 2020, Rohit Industries Group Private Limited and contributors
// For license information, please see license.txt

frappe.ui.form.on('Process Sheet', {
	onload: function(frm){
		frm.set_query("production_item", function(doc) {
			return {
				"filters": {
					"disabled": 0,
					"has_variants": 0,
					"include_item_in_manufacturing":1
				}
			};
		});
	},
	production_item: function(frm){
	    if (frm.doc.production_item){
	        frappe.call({
	            doc: frm.doc,
	            method: "fill_details_from_item",
	            freeze: true,
	            callback: function(r){
	                if (!r.exc){
	                    frm.refresh_fields();
	                }
	            }
	        })
	    }
	}
});

frappe.ui.form.on('BOM Operation', {
    create_new_job_card: function(frm, dt, dn) {
        var child = locals[dt][dn];
        if (child.planned_qty > child.completed_qty && child.status != "Pending") {
            frappe.call({
                method: "rigpl_erpnext.utils.manufacturing_utils.make_jc_from_pro_sheet_row",
                args: {
                    "pro_sheet_row_id": child.name,
                    "pro_sheet_name": frm.doc.name
                },
                callback: function(r){
                    if (!r.exc){
                        frm.refresh_fields();
                    }
                }
            })
        } else if (child.planned_qty > child.completed_qty && child.status === 'Pending'){
            frappe.msgprint("Pending Status")
        }
    }
});