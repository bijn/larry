function Signer()
{
    // Variables -------------------------------------------------------

    this.data = null;
    this.enabled = false;

    this.key = null;
    this.sign_mech = null;
    this.dgst_mech = null;

    this.key_error = false;
    this.data_error = false;

    // Member functions ------------------------------------------------

    this.clear_errors = function() {
        this.key_error = false;
        this.data_error = false;
    };

    this.validate_form = function() {
        validated = true;

        this.clear_errors();

        if(this.key == null) {
            this.key_error = true;
            validated = false;
        }
        if(this.data == null) {
            this.data_error = true;
            validated = false;
        }

        return validated;
    };

    this.key_type = function() {
        if (this.key != null)
        {
            console.log(this.key.p11_type);
            return String(this.key.p11_type);
        }

        return null
    };

    this.sign_mechs = function() {
        mechs = null;
        if (this.key_type() != null)
        {
            mechs = Object.keys(sign_mech_map[this.key_type()]).slice();
            if (mechs != null)
            {
                if (mechs.length <= 0)
                {
                    mechs = null;
                }
                else if (!mechs.includes(this.sign_mech))
                {
                    this.sign_mech = mechs[0];
                }
                else if (this.sign_mech != null)
                {
                    var index = mechs.indexOf(this.sign_mech);
                    if (index >= 0)
                    {
                        mechs.splice(index, 1);
                    }
                }
            }
        }

        return mechs;
    };

    this.sign = function() {
        if(this.validate_form()) {
            $.post(
                sign_url,
                {
                    obj_type: this.key_type(),
                    label: this.key.p11_label,
                    object_id: this.key.p11_id,
                    mech: this.sign_mech,
                    data: this.data,
                }, function (data) {
                    download(data.signed_data, "signed_data.txt", "text");
                }
            );

            this.reset();
        }
    };

    this.verify = function() {
        if(this.validate_form()) {
            console.log(this.data);
            console.log(this.key_type);
            console.log(this.sign_mech);
            console.log(this.dgst_mech);
        }
    };
}
