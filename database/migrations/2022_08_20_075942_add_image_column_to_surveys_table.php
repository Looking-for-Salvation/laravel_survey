<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   /**
    * Run the migrations.
    *
    * @return void
    */
   public function up()
   {
      Schema::table('surveys', function (Blueprint $table) {
         $table->string('image', 255);
      });
   }

   /**
    * Reverse the migrations.
    *
    * @return void
    */
   public function down()
   {
      Schema::table('surveys', function (Blueprint $table) {
         $table->dropColumn('image')->nullable()->after('user_id');
      });
   }
};
