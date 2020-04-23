<template>
    <div id="customers">
        <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h5 class="card-title">All Customer</h5>
                        <div style="position:absolute; right:20px; top:7px">
                            <button @click="create" type="button" class="btn btn-success">
                                Add Customer <i class="fas fa-plus"></i>
                            </button>
                            <button @click="refreshSearch" type="button" class="btn btn-primary">
                                Refresh <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-md-2 col-lg-2 pt-2">
                                    <strong>Search By</strong>
                                </div>
                                <div class="col-md-3 col-lg-3">
                                    <select v-model="queryField" class="form-control">
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="address">Address</option>
                                        <option value="total">Total</option>
                                    </select>
                                </div>
                                <div class="col-md-7 col-lg-7">
                                    <input v-model="query" type="text" class="form-control" placeholder="Search">
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-bordered table-hover">
                                <thead>
                                <tr>
                                    <th width="5%">Serial</th>
                                    <th width="15%">Name</th>
                                    <th width="10%">Email</th>
                                    <th width="15%">Phone</th>
                                    <th width="15%">Address</th>
                                    <th width="10%">Total</th>
                                    <th class="text-center" width="30%">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-show="customers.length" v-for="(customer, index) in customers" :key="customer.id">
                                    <td width="5%">{{index + 1}}</td>
                                    <td width="15%">{{customer.name}}</td>
                                    <td width="10%">{{customer.email}}</td>
                                    <td width="15%">{{customer.phone}}</td>
                                    <td width="15%">{{customer.address}}</td>
                                    <td width="10%">{{customer.total}}</td>
                                    <td  class="text-center" width="30%">
                                        <button @click="showCustomer(customer)" type="button" class="btn btn-info btn-sm text-white">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button @click="editCustomer(customer)" type="button" class="btn btn-success btn-sm">
                                            <i class="far fa-edit"></i>
                                        </button>
                                        <button @click="deleteCustomer(customer)" type="button" class="btn btn-danger btn-sm">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-show="!customers.length">
                                    <td colspan="7">
                                        <div class="alert alert-danger" role="alert">
                                            Ooops! :) Data Not Found
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <pagination v-if="pagination.last_page > 1"
                                       :pagination ="pagination"
                                       :offset="5"
                                       @paginate="query === '' ? allCustomers() : searchData()"
                            ></pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            <vue-progress-bar></vue-progress-bar>
            <vue-snotify></vue-snotify>
    </div>



        <!-- Add customer modal -->
        <div class="modal fade" id="createCustomerModal" tabindex="-1" role="dialog" aria-labelledby="createCustomerLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">{{editMode ? 'Edit' : 'Add'}} Customer</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <form @submit.prevent="editMode ? updateCustomer() : storeCustomer()" @keydown="form.onKeydown($event)">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Name</label>
                                <input v-model="form.name" type="text" name="name"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                                <has-error :form="form" field="name"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input v-model="form.email" type="email" name="email"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                                <has-error :form="form" field="email"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input v-model="form.phone" type="tel" name="phone"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }">
                                <has-error :form="form" field="phone"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <textarea v-model="form.address" rows="5" name="address"
                                          class="form-control" :class="{ 'is-invalid': form.errors.has('address') }"></textarea>
                                <has-error :form="form" field="address"></has-error>
                            </div>
                            <div class="form-group">
                                <label>Total</label>
                                <input v-model="form.total" type="number" name="total"
                                       class="form-control" :class="{ 'is-invalid': form.errors.has('total') }">
                                <has-error :form="form" field="total"></has-error>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button :disabled="form.busy" type="submit" class="btn btn-primary">{{editMode ? "Update" : "Submit"}}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>


        <!-- show customer modal -->
        <div class="modal fade" id="showCustomerModal" tabindex="-1" role="dialog" aria-labelledby="createCustomerLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle2">Show Customer Details</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Name</label>
                            <input v-model="form.name" type="text" name="name"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('name') }" readonly>
                            <has-error :form="form" field="name"></has-error>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input v-model="form.email" type="email" name="email"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('email') }" readonly>
                            <has-error :form="form" field="email"></has-error>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input v-model="form.phone" type="tel" name="phone"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('phone') }" readonly>
                            <has-error :form="form" field="phone"></has-error>
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea v-model="form.address" rows="5" name="address"
                                      class="form-control" :class="{ 'is-invalid': form.errors.has('address') }" readonly></textarea>
                            <has-error :form="form" field="address"></has-error>
                        </div>
                        <div class="form-group">
                            <label>Total</label>
                            <input v-model="form.total" type="number" name="total"
                                   class="form-control" :class="{ 'is-invalid': form.errors.has('total') }" readonly>
                            <has-error :form="form" field="total"></has-error>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        data(){
            return{
                editMode : false,
                query :'',
                queryField: 'name',
                customers:[],
                form: new Form({
                   id:'',
                   name:'',
                   email:'',
                   phone:'',
                   address:'',
                   total:'',
                }),
                pagination:{
                    current_page : 1,
                }
            }
        },
        
        watch:{
            query:function (newQuery, oldQuery) {
                if(newQuery === ''){
                    this.allCustomers()
                }else{
                   this.searchData()
                }
            }
        },
        mounted() {
            this.allCustomers()
        },
        computed:{

        },
        methods:{
            allCustomers(){
                this.$Progress.start()
                axios.get('/api/customers?page='+this.pagination.current_page)
                    .then(response =>{
                        this.customers = response.data.data
                        this.pagination = response.data.meta
                        this.$Progress.finish()
                    })
                    .catch( e =>{
                        console.log(e)
                        this.$Progress.fail()
                    })
            },

            searchData(){
                this.$Progress.start()
                axios.get('/api/search/customers/'+this.queryField+'/'+this.query+'?page='+this.pagination.current_page)
                    .then(response => {
                        this.customers = response.data.data
                        this.pagination = response.data.meta
                        this.$Progress.finish()
                    })
                    .catch(e =>{
                        console.log(e)
                        this.$Progress.fail()
                    })
            },
            refreshSearch(){
                this.allCustomers()
                this.query= ''
                this.queryField = 'name'
                this.$snotify.success('Data Successfully Refreshed', 'Success');
            },

            create(){
                this.editMode = false
                this.form.clear()
                this.form.reset()
                $('#createCustomerModal').modal('show')
            },
            storeCustomer(){
                this.$Progress.start()
                this.form.busy = true
                this.form.post('/api/customers')
                    .then(response => {
                        this.allCustomers()
                        $('#createCustomerModal').modal('hide')
                        if (this.form.successful){
                            this.$Progress.finish()
                            this.$snotify.success('Data Successfully Saved', 'Success');
                        }else{
                            this.$Progress.fail()
                            this.$snotify.error('Data Inserted Fail', 'Error');
                        }
                    })
                    .catch(e =>{
                        this.$Progress.fail()
                        console.log(e)
                    })
            },

            editCustomer(customer){
                this.editMode = true
                this.form.clear()
                this.form.reset()
                this.form.fill(customer)
                $('#createCustomerModal').modal('show')
            },

            updateCustomer(){
                this.$Progress.start()
                this.form.busy = true
                this.form.put('/api/customers/'+ this.form.id)
                    .then(response => {
                        this.allCustomers()
                        $('#createCustomerModal').modal('hide')
                        if (this.form.successful){
                            this.$Progress.finish()
                            this.$snotify.success('Data Successfully Updated', 'Success');
                        }else{
                            this.$Progress.fail()
                            this.$snotify.error('Data Updated Fail', 'Error');
                        }
                    })
                    .catch(e =>{
                        this.$Progress.fail()
                        console.log(e)
                    })
            },

            deleteCustomer(customer) {
                this.$snotify.clear();
                this.$snotify.confirm(
                    "You will not be able to recover this data!",
                    "Are you sure?",
                    {
                        showProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        buttons: [
                            {
                            text: "Yes",
                            action: toast => {
                                this.$snotify.remove(toast.id);
                                this.$Progress.start();
                                axios.delete("/api/customers/" + customer.id)
                                    .then(response => {
                                        this.allCustomers();
                                        this.$Progress.finish();
                                        this.$snotify.success(
                                            "Customer Successfully Deleted",
                                            "Success"
                                        );
                                    })
                                    .catch(e => {
                                        this.$Progress.fail();
                                        console.log(e);
                                    });
                            },
                            bold: true
                            },
                            {
                            text: "No",
                            action: toast => {
                                this.$snotify.remove(toast.id);
                            },
                            bold: true
                            }
                        ]
                    }
                )
            },

            showCustomer(customer){
                this.form.fill(customer)
                $('#showCustomerModal').modal('show')
            }
        }

    }
</script>
