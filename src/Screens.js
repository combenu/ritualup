import { Navigation } from 'react-native-navigation'

import { Icons } from './styles/theme'

export const goToAuth = () =>
  Navigation.setRoot({
    root: {
      stack: {
        id: 'WELCOME',
        children: [
          {
            component: {
              name: 'App.Welcome'
            }
          }
        ]
      }
    }
  })

export const goToHome = () =>
  Navigation.setRoot({
    root: {
      bottomTabs: {
        id: 'BottomTabs',
        children: [
          {
            stack: {
              id: 'GLOBAL',
              children: [
                {
                  component: {
                    name: 'App.Global',
                    passProps: {
                      text: 'Global',
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: 'Global',
                  icon: Icons.global,
                  selectedIcon: Icons.globalSelected,
                  drawBehind: true
                }
              }
            }
          },
          {
            stack: {
              id: 'PERSONAL',
              children: [
                {
                  component: {
                    name: 'App.Personal',
                    passProps: {
                      text: 'Personal'
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: 'Personal',
                  icon: Icons.personal,
                  selectedIcon: Icons.personalSelected
                }
              }
            }
          },
          {
            stack: {
              id: 'TOOLS',
              children: [
                {
                  component: {
                    name: 'App.Tools',
                    passProps: {
                      text: 'Tools'
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: 'Tools',
                  icon: Icons.tools,
                  selectedIcon: Icons.toolsSelected
                }
              }
            }
          },
          {
            stack: {
              id: 'SETTINGS',
              children: [
                {
                  component: {
                    name: 'App.Settings',
                    passProps: {
                      text: 'Settings'
                    }
                  }
                }
              ],
              options: {
                bottomTab: {
                  text: 'Settings',
                  icon: Icons.settings,
                  selectedIcon: Icons.settingsSelected
                }
              }
            }
          }
        ],
        options: {
          bottomTabs: {
            titleDisplayMode: 'alwaysShow'
          }
        }
      }
    }
  })
