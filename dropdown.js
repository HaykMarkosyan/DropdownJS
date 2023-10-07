class Dropdown {
    _text_or_element;
    _sub_dropdowns;
    _dropdown_icon_element;

    _makeDropdown() {
        let dropdown_res = null;
        if(this._sub_dropdowns) {
            dropdown_res = Object.assign(
                document.createElement("div"),
                {className: "dropdown"}
            );

            {
                const is_elem = !!(this._text_or_element instanceof HTMLElement);

                const dropdown_info = dropdown_res.appendChild(Object.assign(
                    document.createElement("div"),
                    {className: "dropdown-info"}
                ));

                {
                    const dropdown_text_elem = dropdown_info.appendChild(Object.assign(
                        document.createElement("div"),
                        {className: `dropdown-${is_elem?"elem":"text"}`}
                    ));

                    if(is_elem) dropdown_text_elem.appendChild(this._text_or_element); else dropdown_text_elem.appendChild(Object.assign(
                        document.createElement("p"),
                        {innerText: this._text_or_element}
                    ));
                }

                {
                    const dropdown_icon_div = dropdown_info.appendChild(Object.assign(
                        document.createElement("div"),
                        {className: "dropdown-icon"}
                    ));

                    dropdown_icon_div.appendChild(this._dropdown_icon_element);

                    dropdown_icon_div.addEventListener("click", () => Dropdown.toggleLevel(dropdown_res));
                    dropdown_icon_div.addEventListener("dblclick", () => Dropdown.toggleAll(dropdown_res));
                }
            }

            {
                const dropdown_sub = dropdown_res.appendChild(Object.assign(
                    document.createElement("div"),
                    {className: "dropdown-sub"}
                ));

                dropdown_sub.style.display = "none";

                for(const sub_dropdown of this._sub_dropdowns) dropdown_sub.appendChild(sub_dropdown._makeDropdown());
            }
        } else {
            dropdown_res = (!!(this._text_or_element instanceof HTMLElement)) ? this._text_or_element : Object.assign(
                document.createElement("p"),
                {innerText: this._text_or_element}
            );
        }

        return dropdown_res;
    }

    constructor(text_or_element, sub_dropdowns = [], dropdown_icon_element) {
        if(!((text_or_element!==undefined&&text_or_element!==null))) throw new Error("Text Or Element is required!");
        if(!(sub_dropdowns!==undefined&&sub_dropdowns!==null)) throw new Error("Sub Dropdowns is required!");
        if(!(dropdown_icon_element!==undefined&&dropdown_icon_element!==null)) throw new Error("Dropdown Icon Element is required!");

        if(!(
            (typeof text_or_element === "string")
            ||
            ((typeof text_or_element === "object")&&(text_or_element instanceof HTMLElement))
        )) throw new Error("Text Or Element must be String or must be instanced of HTMLElement!");

        if(!(Array.isArray(sub_dropdowns))) throw new Error("Sub Dropdowns must be Array!"); else for(const sub_dropdown of sub_dropdowns)
            if(!((typeof sub_dropdown === "object")&&(sub_dropdown instanceof Dropdown))) throw new Error("sub dropdown element of Sub Dropdowns must be instanced of Dropdown!")
        ;

        if(!((typeof dropdown_icon_element === "object")&&(dropdown_icon_element instanceof HTMLElement))) throw new Error("Dropdown Icon Element must be instanced of HTMLElement!");

        this._text_or_element = text_or_element;
        this._sub_dropdowns = sub_dropdowns;
        this._dropdown_icon_element = dropdown_icon_element;
    }

    createDropdown(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement)))) return null;

        const res = this._makeDropdown();

        if(!res) return false;
        element.appendChild(res);

        return res;
    }

    static isDropdown(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement)))) return null;

        return element.classList.contains("dropdown");
    }

    static getDropdownState(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        let res = null;

        {
            const dropdown_sub = element.querySelector(":scope > .dropdown-sub");

            res = (
                element.classList.contains("dropdown-open")
                ? (((!dropdown_sub)||dropdown_sub.style.display==="block")?1:0)
                : (((!dropdown_sub)||dropdown_sub.style.display==="none")?-1:0)
            );
        }

        return res;
    }

    static openLevel(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        if(Dropdown.getDropdownState(element)!==-1) return false;

        {
            const dropdown_sub = element.querySelector(":scope > .dropdown-sub");
    
            element.classList.add("dropdown-open");
            if(dropdown_sub) dropdown_sub.style.display = "block";
        }

        return true;
    }

    static openAll(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        let res = this.openLevel(element);
        
        {
            const dropdowns = element.querySelectorAll(".dropdown");
            for(const dropdown of dropdowns) if(dropdown) res = res===true?this.openLevel(dropdown):res;
        }

        return res;
    }

    static closeLevel(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        if(Dropdown.getDropdownState(element)!==1) return false;

        {
            const dropdown_sub = element.querySelector(":scope > .dropdown-sub");
    
            element.classList.remove("dropdown-open");
            if(dropdown_sub) dropdown_sub.style.display = "none";
        }

        return true;
    }

    static closeAll(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        let res = this.closeLevel(element);
        
        {
            const dropdowns = element.querySelectorAll(".dropdown");
            for(const dropdown of dropdowns) if(dropdown) res = res===true?this.closeLevel(dropdown):res;
        }

        return res;
    }

    static toggleLevel(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        const dropdown_state = Dropdown.getDropdownState(element);

        if(dropdown_state===1) return Dropdown.closeLevel(element);
        if(dropdown_state===-1) return Dropdown.openLevel(element);

        return null;
    }

    static toggleAll(element) {
        if(!(element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement))&&Dropdown.isDropdown(element))) return null;

        const dropdown_state = Dropdown.getDropdownState(element);

        if(dropdown_state===1) return Dropdown.closeAll(element);
        if(dropdown_state===-1) return Dropdown.openAll(element);

        return null;
    }
};




// /**
//  * @class Dropdown
//  * @classdesc The Dropdown Class is used to generate Dropdown in HTML5 (multilevel or single)
//  */
// class Dropdown {
//     _icon_class_name;

//     /**
//      * @function _toggleStyleDisplayOfElement is function that toggles given element display style
//      * 
//      * @access protected
//      * 
//      * @param {Object (HTMLElement)} element The HTMLElement which .style.display is going to toggle
//      * @param {String} element_active_style_display The String which is active display mode for element to toggle if needed
//      * 
//      * @returns {Boolean||null} Boolean based on function successness or null if there is a parameter problem
//      */
//     _toggleElementStyleDisplay(element, element_active_style_display) {
//         if(!(
//             (element!==undefined&&element!==null&&((typeof element === "object")&&(element instanceof HTMLElement)))&&
//             (element_active_style_display!==undefined&&element_active_style_display!==null&&typeof element_active_style_display === "string")
//         )) return null;

//         element.style.display = (element.style.display==="none"?element_active_style_display:"none");

//         return true;
//     }


//     /**
//      * @function makeDropdown is function to create single or multi level dropdown
//      * 
//      * @access protected
//      * 
//      * @param {Object} dropdowns The Array that conains Objects that has to containt or text or elem field and it also can has sub field
//      * @param {Object (HTMLElement)} element The HTMLElement were the Dropdown is going to created
//      * @param {Boolean} element_to_dropdown The Boolean that specifies if the element is going to become dropdown (adding .dropdown if true)
//      * @param {String} icon_className The String that will be the dropdown icon element class name
//      * 
//      * @returns {Array||null} An Array of all dropdowns HTMLElements if there is a parameter problem returns null
//      */
//     _makeDropdown(dropdowns, element, iconClassName) {}



//     constructor(dropdowns, element, iconClassName) {
//         if(!(dropdowns!==undefined&&dropdowns!==null)) throw new Error("Dropdown is requried!");
//         if(!(element!==undefined&&element!==null)) throw new Error("Element is required!");
//         if(!(iconClassName!==undefined&&iconClassName)) throw new Error("Icons Class Name is required!");

//         if(!Array.isArray(dropdowns)) throw new Error("Dropdwon must be Array!");
//         if(!(element instanceof HTMLElement)) throw new Error("Element bust be instanced of HTMLElement!");
//         if(!(typeof iconClassName === "string")) throw new Error("Icons Class Name is  required!");

//         this._icon_class_name = iconClassName;

//         makeDropdown(dropdowns, element, iconClassName);
//     }

//     openLevel(dropdown_element) {}

//     openAll(dropdown_element) {}

//     closeLevel(dropdown_element) {}

//     closeAll(dropdown_element) {}

//     toggleLevel(dropdown_element) {}

//     toggleAll(dropdown_element) {}
// };


// /**
//  * @function makeDropdown is function to create single or multi level dropdown
//  * 
//  * @param {Object} dropdowns The Array that conains Objects that has to containt or text or elem field and it also can has sub field
//  * @param {HTMLElement} element The HTMLElement were the Dropdown is going to created
//  * @param {Boolean} element_to_dropdown The Boolean that specifies if the element is going to become dropdown (adding .dropdown if true)
//  * @param {String} icon_className The String that will be the dropdown icon element class name
//  * 
//  * @returns {Array||null} An Array of all dropdowns HTMLElements if there is a parameter problem returns null
//  */
// function makeDropdown(dropdowns, element, icon_className = "bi bi-arrow") {
//     if(!(
//         (dropdowns!==undefined&&dropdowns!==null&&Array.isArray(dropdowns))&&
//         (element!==undefined&&element!==null&&(element instanceof HTMLElement))&&
//         (icon_className!==undefined&&icon_className!==null&&(typeof icon_className === "string"))
//     )) return null;

//     const res = [];

//     for(const dropdown of dropdowns) if(dropdown) {
//         let dropdown_html = null;
//         if(dropdown.sub) {
//             dropdown_html = element.appendChild(Object.assign(
//                 document.createElement("div"),
//                 {className: "dropdown"}
//             ));

//             {
//                 const is_elem = !!dropdown.elem;
            
//                 const dropdown_info = dropdown_html.appendChild(Object.assign(
//                     document.createElement("div"),
//                     {className: "dropdown-info"}
//                 ));
    
//                 {
//                     const dropdown_text_elem = dropdown_info.appendChild(Object.assign(
//                         document.createElement("div"),
//                         {className: `dropdown-`+(is_elem?"elem":"text")}
//                     ));
    
//                     if(is_elem) dropdown_text_elem.appendChild(dropdown.elem); else dropdown_text_elem.appendChild(
//                         Object.assign(document.createElement("p"), {innerText: dropdown.text}
//                     ));
//                 }

//                 {
//                     const dropdown_icon_div = dropdown_info.appendChild(Object.assign(
//                         document.createElement("div"),
//                         {className: "dropdown-icon"}
//                     ));

//                     dropdown_icon_div.appendChild(Object.assign(
//                         document.createElement("i"),
//                         {className: icon_className}
//                     ));

//                     {
//                         /**
//                          * @function toggleStyleDisplayOfElement is function that toggles given element display style
//                          * 
//                          * @param {HTMLElement} element The HTMLElement which .style.display is going to toggle
//                          * @param {String} display_mode The String which is active display mode for element to toggle if needed
//                          * 
//                          * @returns {Boolean||null} Boolean based on function successness or null if there is a parameter problem
//                          */
//                         function toggleStyleDisplayOfElement(element, display_mode = "block") {
//                             if(!(
//                                 (element!==undefined&&element!==null&&(element instanceof HTMLElement))&&
//                                 (display_mode!==undefined&&display_mode!==null&&typeof display_mode === "string")
//                             )) return null;

//                             const element_style_display = element.style.display;

//                             element.style.display = element_style_display==="none"?display_mode:"none";

//                             return true;
//                         }

//                         dropdown_icon_div.addEventListener("click", function() {
//                             const sub_dropdown = dropdown_html.querySelector(":scope > .dropdown-sub");

//                             toggleStyleDisplayOfElement(sub_dropdown);
//                         });


//                         dropdown_icon_div.addEventListener("dblclick", function() {
//                             const subs_dropdowns = dropdown_html.querySelectorAll(".dropdown-sub");

//                             if(subs_dropdowns&&typeof subs_dropdowns[Symbol.iterator] === "function")
//                                 for(const sub_dropdown of subs_dropdowns) toggleStyleDisplayOfElement(sub_dropdown)
//                             ;
//                         });
//                     }
//                 }
//             }

//             {
//                 const dropdown_sub = dropdown_html.appendChild(Object.assign(
//                     document.createElement("div"),
//                     {className: "dropdown-sub"}
//                 ));

//                 dropdown_sub.setAttribute("style", "dispaly: none;");

//                 makeDropdown(dropdown.sub, dropdown_sub, icon_className);
//             }
//         } else {
//             if(dropdown.elem) element.appendChild(dropdown.elem); else element.appendChild(Object.assign(
//                 document.createElement("p"),
//                 {innerText: dropdown.text}
//             ));
//         }

//         res.push(dropdown_html);
//     }

//     return res;
// }