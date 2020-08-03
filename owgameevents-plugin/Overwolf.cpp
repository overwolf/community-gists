#include "Headers\Overwolf.h"
#include "Headers\Logger.h"
#include "Headers\Config.h"

#pragma comment(lib, "libowgameevents.lib")

#define MACRO_ARRAYSIZE(a) \
  ((sizeof(a) / sizeof(*(a))) / \
   static_cast<size_t>(!(sizeof(a) % sizeof(*(a)))))

using namespace owgame_events;

Overwolf* Overwolf::_instance = 0;

Overwolf::Overwolf()
{
	_owLoaded = false;
}

Overwolf::~Overwolf()
{
}

Overwolf* Overwolf::instance()
{
	if (!_instance) {
		_instance = new Overwolf();
	}

	return _instance;
}

void Overwolf::initalize(std::string steamID, bool isMultiplayer, scs_string_t game_id, std::string token)
{
	std::string game_id_parsed = "";

	if (strcmp(game_id, SCS_GAME_ID_EUT2) == 0) {
		game_id_parsed = "ETS2";
		_owgame_game_id = 8584;
	}
	else
	{
		game_id_parsed = "ATS";
		_owgame_game_id = 10874;
	}

	if (_owgame_game_id != 0)
	{
		_owLoaded = _dll.Initialize(L"libowgameevents.dll");

		if (_owLoaded) Logger::instance()->info("Overwolf dll loaded");
		else Logger::instance()->error("Overwolf dll NOT loaded");

		OWGameEventsErrors owResult = _dll.owgame_events_turn_on_logger(L"TruckyOverwolfEvents.txt");

		if (owResult != SUC_OK)
		{
			Logger::instance()->warning("Overwolf Event logger not initialized");
		}

		std::string kCategoryPlayer = "player";
		std::string kCategoryGame = "game";
		const char kInfoKeySteamID[] = "steamID";
		const char kInfoGameID[] = "game_id";
		const char kInfoKeyTelemetry[] = "telemetry";
		const char kInfoKeyIsMultiplayer[] = "isMultiplayer";
		const char kInfoKeyGameIsRunning[] = "game_is_running";
		const char kInfoKeytruckyToken[] = "truckyToken";


		owgame_info_key player_keys[] = {
			{ kInfoKeySteamID, 17 },
			{kInfoKeytruckyToken,145 }
		};

		owgame_info_key game_keys[] = {
			{ kInfoKeyIsMultiplayer, 14 },
			{ kInfoGameID, 8 },
			{ kInfoKeyTelemetry, 10 },
			{ kInfoKeyGameIsRunning, 16 }
		};

		owgame_info_category categories[] = {
		  { kCategoryPlayer.c_str(), MACRO_ARRAYSIZE(player_keys), player_keys },
		  { kCategoryGame.c_str(), MACRO_ARRAYSIZE(game_keys), game_keys }
		};

		owResult = _dll.owgame_events_create(_owgame_game_id, 2, categories, &_owgameevents);

		if (owResult != SUC_OK)
			Logger::instance()->warning(("Overwolf Events not created " + std::to_string(owResult)).c_str());
		else
			Logger::instance()->info("Overwolf Events created");

		Logger::instance()->info("Overwolf Begin Transaction");

		owResult = _dll.owgame_events_begin_info_transaction(_owgameevents);

		if (owResult != SUC_OK)
			Logger::instance()->warning(("Overwolf Transaction failed " + std::to_string(owResult)).c_str());

		owResult = _dll.owgame_events_set_info_key(
			_owgameevents, kCategoryPlayer.c_str(), kInfoKeySteamID, steamID.size(), steamID.c_str());

		if (owResult != SUC_OK)
			Logger::instance()->warning("Overwolf INFO Set SteamID failed");
		else
			Logger::instance()->info("Overwolf INFO Set SteamID successful");

		owResult = _dll.owgame_events_set_info_key(
			_owgameevents, kCategoryPlayer.c_str(), kInfoKeytruckyToken, token.size(), token.c_str());

		if (owResult != SUC_OK)
			Logger::instance()->warning("Overwolf INFO Set token failed");
		else
			Logger::instance()->info("Overwolf INFO Set token successful");

		owResult = _dll.owgame_events_set_info_key(
			_owgameevents, kCategoryGame.c_str(), kInfoGameID, game_id_parsed.size(), game_id_parsed.c_str());

		if (owResult != SUC_OK)
			Logger::instance()->warning("Overwolf INFO Set GameID failed");
		else
			Logger::instance()->info("Overwolf INFO Set GameID successful");

		std::string owMultiplayerInfo = "0";

		if (isMultiplayer)
			owMultiplayerInfo = "1";

		owResult = _dll.owgame_events_set_info_key(
			_owgameevents, kCategoryGame.c_str(), kInfoKeyIsMultiplayer, owMultiplayerInfo.size(), owMultiplayerInfo.c_str());

		if (owResult != SUC_OK)
			Logger::instance()->warning("Overwolf INFO Set IsMultiplayer failed");
		else
			Logger::instance()->info("Overwolf INFO Set IsMultiplayer successful");

		owResult = _dll.owgame_events_set_info_key(
			_owgameevents, kCategoryGame.c_str(), kInfoKeyGameIsRunning, 1, "1");

		owResult = _dll.owgame_events_commit_info_transaction(_owgameevents);

		if (owResult != SUC_OK)
			Logger::instance()->warning("Overwolf Transaction commit fail");
		else
			Logger::instance()->info("Overwolf Transaction committed");
	}
	else
		Logger::instance()->error("Overwolf is not supported");
}

void Overwolf::close()
{
	OWGameEventsErrors owResult = _dll.owgame_events_set_info_key(
		_owgameevents, "game", "game_is_running", 1, "0");

	if (owResult != SUC_OK)
		Logger::instance()->warning("Overwolf INFO Set GameIsRunning failed");
	else
		Logger::instance()->info("Overwolf INFO Set GameIsRunning successful");

	_dll.owgame_events_close(_owgameevents);

	Logger::instance()->info("Overwolf events channel closed");
}

owgame_id Overwolf::getOwGameID()
{
	return _owgame_game_id;
}

bool Overwolf::isOverwolfLoaded()
{
	return _owLoaded;
}

void Overwolf::sendTelemtryUpdateJSON(std::string eventData)
{
	owgame_event event = { "telemetry" };
	strcpy(event.data, eventData.c_str());

	OWGameEventsErrors owResult = _dll.owgame_events_trigger_event(_owgameevents, &event);
}

void Overwolf::sendGameplayEventJSON(std::string eventData)
{
	owgame_event event = { "gameplay_event" };
	strcpy(event.data, eventData.c_str());

	OWGameEventsErrors owResult = _dll.owgame_events_trigger_event(_owgameevents, &event);
}

void Overwolf::sendMenuEventJSON(std::string eventData)
{
	owgame_event event = { "menu_event" };
	strcpy(event.data, eventData.c_str());

	OWGameEventsErrors owResult = _dll.owgame_events_trigger_event(_owgameevents, &event);
}