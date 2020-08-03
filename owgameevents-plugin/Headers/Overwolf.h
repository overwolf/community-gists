#pragma once
#include <owgame_events.h>
#include "Common.h"
#include "pdll.h"

using namespace owgame_events;

class OWGameEventsDll : public PDLL {
	DECLARE_FUNCTION4(__stdcall, OWGameEventsErrors, owgame_events_create, owgame_id, unsigned int, owgame_info_category*, owgame_events_handle*)
	DECLARE_FUNCTION5(__stdcall, OWGameEventsErrors, owgame_events_set_info_key, owgame_events_handle, const char*, const char*, unsigned int, const char*)
	DECLARE_FUNCTION2(__stdcall, OWGameEventsErrors, owgame_events_trigger_event, owgame_events_handle, owgame_event*)
	DECLARE_FUNCTION1(__stdcall, OWGameEventsErrors, owgame_events_begin_info_transaction, owgame_events_handle)
	DECLARE_FUNCTION1(__stdcall, OWGameEventsErrors, owgame_events_commit_info_transaction, owgame_events_handle)
	DECLARE_FUNCTION1(__stdcall, OWGameEventsErrors, owgame_events_close, owgame_events_handle)
	DECLARE_FUNCTION1(__stdcall, OWGameEventsErrors, owgame_events_turn_on_logger, const wchar_t*)
};

	class Overwolf
	{
	public:
		Overwolf();
		~Overwolf();

		static Overwolf* instance();
		void initalize(std::string steamID, bool isMultiplayer, scs_string_t game_id,std::string token);
		owgame_id getOwGameID();
		void close();
		void sendTelemtryUpdateJSON(std::string eventData);
		void sendGameplayEventJSON(std::string eventData);
		bool isOverwolfLoaded();
		void sendMenuEventJSON(std::string eventData);
	private:
		static Overwolf* _instance;
		owgame_id _owgame_game_id;
		owgame_events_handle _owgameevents; // our one and only handle
		OWGameEventsDll _dll;
		bool _owLoaded;
		owgame_info_category categories[2];
		scs_log_t game_log;
	};

