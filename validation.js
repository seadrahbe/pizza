export function validateForm(data) {
  console.log("Server-side validation happens here.");
  console.log(data);

/*{
    fname: 'skjhf',
    lname: 'fdhskjf',
    email: 'ffhskdjhf',
    method: 'delivery',
    toppings: [ 'mushrooms', 'banana-peppers' ],
    size: 'medium',
    comment: '',
    discount: 'on'
  } */

  // Store error messages in an array
  const errors = [];

  // Validate first name
  if (!data.fname || data.fname.trim() == "") {
    errors.push("First name is required.");
  }
  
  // Validate last name
  if (!data.lname || data.lname.trim() == "") {
    errors.push("Last name is required.");
  }

  // Validate method (pick-up or delivery)
  const validMethods = ['pickup', 'delivery'];
  if (!validMethods.includes(data.method)) {
    errors.push("Method must be pickup or delivery.");
  }

  // Validate size (small, medium, large)
  const validSizes = ['small', 'medium', 'large'];
  if (!validSizes.includes(data.size)) {
    errors.push("Size must be small, medium, or large.");
  }

  // Validate toppings
  const validToppings = ['pepperoni', 'banana-peppers', 'mushrooms', 'artichokes', 'tomatoes'];
  let isValidToppings = true;
  if (Array.isArray(data.toppings)) {
    data.toppings.forEach(topping => {
      if (!validToppings.includes(topping)) {
        isValidToppings = false;
      }
    })

    if (!isValidToppings) {
      errors.push("Invalid topping entered.")
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}