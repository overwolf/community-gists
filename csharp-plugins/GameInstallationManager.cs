using Gameloop.Vdf;
using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace overwolf.plugins
{
    public class GameInstallationManager
    {
        public void checkGameIsInstalled(string game, Action<object> callback)
        {
            try
            {
                bool gameIsInstalled = false;

                RegistryReader rr = new RegistryReader();
                RegistryKeyReadResult steamLibraryRegistry = rr.getValueFromLocalMachineSync(@"SOFTWARE\WOW6432Node\Valve\Steam", "InstallPath");

                if (steamLibraryRegistry.exists)
                {
                    string libraryVdfPath = Path.Combine(steamLibraryRegistry.value.ToString(), "steamapps", "libraryfolders.vdf");

                    if (File.Exists(libraryVdfPath))
                    {
                        string libraryVdfFileContents = File.ReadAllText(libraryVdfPath);
                        var vdf = VdfConvert.Deserialize(libraryVdfFileContents);

                        if (vdf != null && vdf.Value != null)
                        {
                            List<string> libraryFolders = new List<string>();

                            // adding default library
                            libraryFolders.Add(Path.Combine(steamLibraryRegistry.value.ToString()));

                            for (int i = 1; i <= 100; i++)
                            {
                                if (vdf.Value[i.ToString()] != null)
                                {
                                    libraryFolders.Add(vdf.Value[i.ToString()].ToString());
                                }
                                else
                                    break;
                            }

                            foreach (string libraryPath in libraryFolders)
                            {
                                string gamePath = Path.Combine(libraryPath, "steamapps", "common", game);

                                if (Directory.Exists(gamePath))
                                {
                                    gameIsInstalled = true;

                                    callback(new
                                    {
                                        libraryFolders = libraryFolders,
                                        steamPath = steamLibraryRegistry.value,
                                        status = "success",
                                        installed = true,
                                        path = gamePath
                                    });

                                    break;
                                }
                            }

                            if (!gameIsInstalled)
                            {
                                callback(new
                                {
                                    libraryFolders = libraryFolders,
                                    steamPath = steamLibraryRegistry.value,
                                    status = "success",
                                    installed = false,
                                    path = ""
                                });
                            }
                        }
                        else
                        {
                            callback(new
                            {
                                status = "error",
                                error = "LibraryFolders.vdf not parsed",
                            });
                        }
                    }
                    else
                    {
                        callback(new
                        {
                            status = "error",
                            error = "LibraryFolders.vdf not found",
                        });
                    }
                }
                else
                {
                    callback(new
                    {
                        status = "error",
                        error = "Steam not found",
                    });
                }
            }
            catch (Exception ex)
            {
                callback(new
                {
                    status = "error",
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }
}