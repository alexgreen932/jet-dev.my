
export default function j_form_toolbar(str){
    console.log('str--------------- ', str);
    if (!this.j_form_data) {
        console.log('this.j_form_data: ', this.j_form_data);
        if (!this.j_form_data.toolbar ) {
            return str
        }
    };
    

}

