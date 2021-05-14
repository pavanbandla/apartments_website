const homeRoutes = require('./home');
const signupRoutes = require('./signup');
const signinRoutes = require('./signin');
const signoutRoutes = require('./signout');
const apartmentRoutes = require('./apartment');
const profileRoutes = require('./profile');

const constructorMethod = (app) => {

  app.use('/', homeRoutes);
  app.use('/signup', signupRoutes);
  app.use('/signin', signinRoutes);
  app.use('/signout', signoutRoutes); 
  app.use('/apartment', apartmentRoutes);
  app.use('/profile', profileRoutes);

    
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;